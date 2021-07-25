import React from "react";

class UrlEncodeForm extends React.Component {

    private decodedTextArea = React.createRef<HTMLTextAreaElement>()
    private encodedTextArea = React.createRef<HTMLTextAreaElement>()

    render() {
        return (
            <div>
                <div>
                    <textarea ref={this.decodedTextArea} rows={4} cols={100} />
                </div>
                <div>
                    <button onClick={this.onClickUrlEncode.bind(this)}>▼URLエンコード</button>
                    <button onClick={this.onClickUrlDecode.bind(this)}>▲URLデコード</button>
                </div>
                <div>
                    <textarea ref={this.encodedTextArea} rows={4} cols={100} />
                </div>
            </div>
        )
    }

    onClickUrlEncode(e: React.MouseEvent<HTMLElement>) {
        const decodedText = this.decodedTextArea.current.value
        this.encodedTextArea.current.value = encodeURIComponent(decodedText)
    }

    onClickUrlDecode(e: React.MouseEvent<HTMLElement>) {
        const encodedText = this.encodedTextArea.current.value
        this.decodedTextArea.current.value = decodeURIComponent(encodedText)
    }
}

export default UrlEncodeForm
