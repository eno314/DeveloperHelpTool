# Developer Help Tool

開発者の日々の作業を支援するためのツール群です。

[![codecov](https://codecov.io/gh/eno314/DeveloperHelpTool/branch/master/graph/badge.svg?token=NGLYKX6L70)](https://codecov.io/gh/eno314/DeveloperHelpTool)

## ページ一覧と機能概要

当アプリケーションでは、以下のツールを提供しています。

- **JSON Parse Tool**: JSONをパースして整形・検証するツールです。
- **JSON Compare Tool**: 2つのJSONを比較し、差分を確認できるツールです。
- **String Replace Tool**: 文字列の検索・置換を簡単に行うツールです。
- **Url Encode And Decode Tool**: URLのエンコードおよびデコードを行うツールです。
- **Url Parse Tool**: URLをパースし、クエリパラメータ等を組み立てるツールです。
- **Amidakuji Tool**: あみだくじ（Ghost Leg）を作成・実行できるツールです。
- **Base64 Encode And Decode Tool**: Base64形式のエンコードおよびデコードを行うツールです。
- **Curl Builder Tool**: HTTPリクエストを構築し、cURLコマンドを生成するツールです。

## ローカルでの開発手順と使用条件

### 使用条件 (Prerequisites)

- Node.js `>=24.0.0`
- npm

### インストール

リポジトリをクローン後、依存パッケージをインストールします。

```sh
npm install
```

### 開発用サーバーの起動

ローカル環境で開発用サーバーを起動します。

```sh
npm run dev
```

起動後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

### テストの実行

Jestによるユニットテストを実行します。

```sh
npm run test
```

カバレッジを出力する場合は以下のコマンドを実行します。

```sh
npm run test:coverage
```

PlaywrightによるE2Eテストを実行する場合は以下のコマンドを実行します。

```sh
npx playwright test playwright_tests/
```

## 脆弱性の確認・修正 (Support Vulnerability)

脆弱性のチェック:

```sh
npm audit
```

自動修正の適用:

```sh
npm update
```

## ライセンス

このプロジェクトは [Apache License 2.0](LICENSE) のもとで公開されています。
