import React, { ReactNode } from "react";

class UrlEncodeForm extends React.Component {

    private readonly textAreaStyle = {
        height: 100
    };

    private readonly decodedTextArea = React.createRef<HTMLTextAreaElement>()
    private readonly encodedTextArea = React.createRef<HTMLTextAreaElement>()

    constructor(prop: any) {
        super(prop)

        this.onClickUrlEncode = this.onClickUrlEncode.bind(this)
        this.onClickUrlDecode = this.onClickUrlDecode.bind(this)
    }

    render(): ReactNode {
        return (
            <div className={"container"}>
                <div className={"row form-floating"}>
                    <textarea
                        ref={this.decodedTextArea}
                        id="floatingTextarea"
                        className={"form-control textarea"}
                        style={this.textAreaStyle}
                    />
                    <label htmlFor={"floatingTextarea"}>Please input text you'd like to encode.</label>
                </div>
                <div className={"row"}>
                    <div className={"col text-center"}>
                        <button type={"button"} className={"btn btn-primary"} onClick={this.onClickUrlEncode}>▼ Apply URL Encoding</button>
                    </div>
                    <div className={"col text-center"}>
                        <button type={"button"} className={"btn btn-primary"} onClick={this.onClickUrlDecode}>▲ Apply URL Decoding</button>
                    </div>
                </div>
                <div className={"row form-floating"}>
                    <textarea
                        ref={this.encodedTextArea}
                        id="floatingTextarea"
                        className={"form-control textarea"}
                        style={this.textAreaStyle}
                    />
                    <label htmlFor={"floatingTextarea"}>Please input text you'd like to decode.</label>
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
