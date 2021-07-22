# Next.js tips

## src ディレクトリ

src 以下であれば、pages のルーティングはデフォルトで効く

スターターキットでは src ディレクトリが無いので、srcを作成したら、pages と styles を src 以下に移動すると良い

## TypeScript 化する

TypeScript 関連パッケージをインストール

```text
yarn add -D typescript @types/react
```

pages に配備されている、index.js と _app.js の拡張子を .tsx に変更する

next.js を起動すると、tsconfig.json が生成される

生成された tsconfig.json に以下の項目を追加する (パス指定の簡略化のため)

```json
  "compilerOptions": {
    ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
```
