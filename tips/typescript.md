# TypeScript tips

## next.js を TypeScript 化する

TypeScript 関連パッケージをインストール

```
$ yarn add -D typescript @types/react
```

pages に配備されている、index.js と _app.js の拡張子を .tsx に変更する

next.js を起動すると、tsconfig.json が生成される

生成された tsconfig.json に以下の項目を追加する (パス指定の簡略化のため)

```
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
