# 【フェーズ3】Next.jsからHonoへの段階的移行計画

本計画は、「ビッグバン・リライト」を避け、既存のNext.js環境を維持したまま、段階的にHono（および将来のSPA化）へ移行するためのステップバイステップのガイドラインです。

## 最初のターゲット機能の提案
**ターゲット機能: String Replace Tool (`src/app/string/replace/page.tsx`)**

**選定理由:**
1. 外部API通信や複雑な状態管理がなく、単純な文字列操作のみであるため。
2. ロジック（`replaceStr`）が明確で、`src/utils/` への分離が容易であるため。
3. UIがシンプル（入力・ボタン・出力）であり、Honoによる静的ファイル配信とクライアントサイドSPAの初期検証（ステップ2）に最も適しているため。

---

## 段階的移行のステップ（詳細）

### ステップ1: ロジックの分離 (Preparation) 【完了】
Next.jsのReactコンポーネント内に残っている固有のロジックを、特定のフレームワークに依存しない純粋な関数として `src/utils/` に分離します。

*   **作業内容:**
    *   `src/components/molecules/StringReplaceForm/StringReplaceForm.tsx` 内にある `replaceStr` などの純粋な文字列操作ロジックを抽出します。
    *   抽出した関数を `src/utils/stringUtils.ts` (仮称) に移動します。
    *   Next.js側のコンポーネント (`StringReplaceForm.tsx`) は、新しく作成した `src/utils/stringUtils.ts` の関数をインポートして使用するように修正します。
*   **検証項目:**
    *   抽出した関数に対して `src/utils/stringUtils.test.ts` を作成し、Deno標準のテスト（`Deno.test`, `jsr:@std/expect`）で純粋なロジックとしての動作を保証します。
    *   Next.jsのローカルサーバー (`npm run dev`) を起動し、既存のPlaywrightテストが引き続きパスすることを確認します。

### ステップ2: Honoの導入と小さな検証 (Proof of Concept) 【完了】
Next.js（ポート3000）を維持したままHonoをインストールし、完全に独立したDenoプロセス（ポート8000等）としてHonoサーバーを立ち上げます。最初のターゲットである「String Replace Tool」のみを、将来のSPA化を見据えた最小構成でHonoから配信し、ルーティングとレンダリングの検証を行います。

*   **作業内容:**
    *   プロジェクトに `hono` をインストールします（例: `npm install hono` または `deno add npm:hono`）。
    *   プロジェクトルート（または `src/server/` など）に、独立したHonoサーバーのエントリポイント（例: `server.ts`）を作成します。
    *   **SPAのプロトタイプ作成:** 「String Replace Tool」のUIを、ビルド済み静的ファイル（HTML/JS/CSS）として用意します（この段階では簡易的なバンドラーや生Reactを使用し、`public/` または `dist/` ディレクトリに出力します）。
    *   Honoサーバーを静的ファイル配信サーバーとして設定し、`/string/replace` エンドポイントで上記のSPAを返すようにルーティングを定義します。
*   **検証項目:**
    *   Next.jsサーバー（3000）とHonoサーバー（8000）を同時に起動します。
    *   ブラウザで `http://localhost:8000/string/replace` にアクセスし、「String Replace Tool」がSPAとして正常に動作することを確認します。
    *   Playwrightのテスト設定を一時的に拡張（または複製）し、Honoサーバー（ポート8000）に対して「String Replace Tool」のE2Eテストを実行し、パスすることを確認します。

### ステップ3: ページごとの段階的移行 (Iterative Migration)
ステップ2で確立した「SPAビルド + Hono静的配信」の仕組みをベースに、残りのツール群を1つずつHonoへ移行していきます。ここで本格的なSPAビルド環境（Vite等）の導入を検討します。

*   **対象ツール:**
    *   URL Encode/Decode (`src/app/url/`)
    *   JSON Compare/Format (`src/app/json/`)
    *   Timestamp Converter (`src/app/timestamp/`)
    *   cURL Builder (`src/app/curl/`)
    *   Amidakuji (`src/app/amidakuji/`)
*   **作業サイクル（各ツールごとに実施）:**
    1.  **ロジック分離:** 対象ツールの固有ロジックを `src/utils/` へ抽出し、Denoテストを追加。
    2.  **SPA化:** UIコンポーネントをSPAビルド環境（Vite等）へ移植。
    3.  **Honoルーティング追加:** Honoサーバーに該当ツールのルーティングと静的配信設定を追加。
    4.  **テスト検証:** Playwrightテストの対象URLをHonoサーバーに向け、既存のE2Eテストがパスすることを確認。

### ステップ4: Next.jsの完全削除 (Cleanup)
全ての機能がSPAとしてビルドされ、Honoサーバーで完全に動作し、全てのPlaywrightテストがHonoサーバー経由でパスすることを確認した後、不要となったNext.js環境を完全に削除します。

*   **作業内容:**
    *   `package.json` から `next`, `react-dom/server` 等のNext.js関連依存パッケージを削除します。
    *   `src/app/` ディレクトリを完全に削除します。
    *   `next.config.mjs`, `middleware.ts`, `next-env.d.ts` 等のNext.js固有の設定ファイルを削除します。
    *   `tsconfig.json` の設定（`plugins`: `next` 等）や `eslint.config.mjs` をHono/ViteベースのSPA構成に合わせてクリーンアップします。
    *   CI/CDパイプライン（GitHub Actions等）のビルド・起動コマンドをNext.jsからHono/SPAビルド向けに修正します。
