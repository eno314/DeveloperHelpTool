# React TIPS

## コールバック関数の中で this を呼び出す

以下のようなコードは、undefined になってしまう

```javascript
    private text = 'hoge';

    render() {
        return <button onClick={this.onClick}>hoge</button>
    }

    onClick(e: React.MouseEvent<HTMLElement>) {
        // show error `TypeError: Cannot read property 'text' of undefined`
        alert(this.text)
    }
}
```

JSX のコールバック関数内で this を呼ぶ場合、バインドする必要がある

クリックのたびにバインドするのではなく、コンストラクタでバインドしたほうが、呼び出しコストが低い

```javascript
    private text = 'hoge';

    constructor() {
        super({})
        this.onClick = this.onClick.bind(this)
    }

    render() {
        return <button onClick={this.onClick}>hoge</button>
    }

    onClick(e: React.MouseEvent<HTMLElement>) {
        alert(this.text)
    }
}
```
