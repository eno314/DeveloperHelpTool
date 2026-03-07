# test tips

## Next.js + TypeScript + Jest

### パッケージの追加

```test
npm install -D jest @types/jest ts-jest
```

TypeScript のコードをテストするために、`@types/jest` と `ts-jest` が必要になる

### jestの設定ファイルを用意

プロジェクト直下に、`jest.config.js` を用意する。中身は以下。

```js
module.exports = {
    // ts-jest を使って jest を実行する
    preset: "ts-jest",
    globals: {
        // テスト用のTypeScriptの設定ファイルを使うようにする
        'ts-jest': {
            tsconfig: 'tsconfig.jest.json',
        },
    },
}
```

テスト用の tsconfig を `tsconfig.jest.json` という名前で用意する（名前はなんでもいい）。中身は以下。

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

## React Testing Library

<https://testing-library.com/docs/react-testing-library/intro/>

Reactコンポーネントをテストしやすくするためのライブラリ。

### パッケージの追加

```text
npm install -D @testing-library/react @testing-library/jest-dom
```

`@testing-library/jest-dom` は、Dom要素の詳細な matchers を提供してくれるライブラリ。一緒に入れておいた方がいい。

### 設定ファイル更新

`jest.config.js` を更新する

```js
module.exports = {
    ...
    // テスト実行時に jest-dom を読み込ませる
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
}
```

### テストのサンプル

```js
/**
 * // デフォルトが node なので、jsdom を使ったテストをする際は、jsdomを設定する
 * @jest-environment jsdom
 */

import Index from "./Index";
import { render, screen } from '@testing-library/react';

describe('Index', () => {
    test('renders Index component', () => {
        render(<Index />);
        expect(screen.getAllByRole("link")).toHaveLength(2);
    });
});
```
