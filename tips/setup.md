# 環境構築系のTIPS

## nodenv

```text
# インストール
brew install nodenv

# 利用できるバージョン確認
nodenv install -l

# 対象バージョンインストール
nodenv install [バージョン]
```

nodeコマンドが使えるように、zshrc に以下を追加

```text
eval "$(nodenv init -)"
```

## yarn

インストール

```text
brew install yarn
```

package.json の内容をローカルにインストール

```text
yarn install
```
