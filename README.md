# Developer Help Tool

開発者の日々の作業を支援するためのツール群です。

[![codecov](https://codecov.io/gh/eno314/DeveloperHelpTool/branch/main/graph/badge.svg?token=NGLYKX6L70)](https://codecov.io/gh/eno314/DeveloperHelpTool)

## ページ一覧と機能概要

当アプリケーションでは、以下のツールを提供しています。

- **Amidakuji Tool**: あみだくじ（Ghost Leg）を作成・実行できるツールです。
- **Curl Builder Tool**:
  HTTPリクエストを構築し、cURLコマンドを生成するツールです。
- **Encode And Decode Tool**:
  URLとBase64、JSON形式のエンコードおよびデコードを行うツールです。
- **JSON Compare Tool**: 2つのJSONを比較し、差分を確認できるツールです。
- **String Count Tool**: 文字列の文字数とUTF-8のバイト数をカウントするツールです。
- **String Replace Tool**: 文字列の検索・置換を簡単に行うツールです。
- **Timestamp Tool**:
  現在の時刻とタイムスタンプを表示し、タイムスタンプをコピーできるツールです。
- **Url Parse Tool**: URLをパースし、クエリパラメータ等を組み立てるツールです。

## ローカルでの開発手順と使用条件

### 使用条件 (Prerequisites)

- Deno

### インストール

リポジトリをクローン後、Denoの依存関係をインストールします（通常はタスク実行時に自動で解決されます）。

```sh
deno install
```

### 開発用サーバーの起動 (Deno環境)

ローカル開発環境ではDenoを使用して開発用サーバーを起動します。（`deno.json`
に設定されています）

```sh
deno task dev
```

起動後、ブラウザで
[http://localhost:5173/DeveloperHelpTool/](http://localhost:5173/DeveloperHelpTool/)
にアクセスしてください。（ポート番号は環境により異なる場合があります）

※ アプリケーションは GitHub Pages にデプロイされます。

### テストの実行

Denoによるユニットテストを実行します。

```sh
deno task test
```

カバレッジを出力する場合は以下のコマンドを実行します。

```sh
deno task test:coverage
```

PlaywrightによるE2Eテストを実行する場合は以下のコマンドを実行します。

```sh
deno run -A npm:playwright test playwright_tests/
```

## 脆弱性の確認・修正 (Support Vulnerability)

脆弱性のチェック:

```sh
deno audit
```

## ライセンス

このプロジェクトは [Apache License 2.0](LICENSE) のもとで公開されています。
