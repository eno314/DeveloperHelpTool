import React, { ReactNode } from "react";

type State = {
    decodedText: string,
    encodedText: string,
}

class UrlEncodeForm extends React.Component<{}, State> {

    private readonly textAreaStyle = {
        height: 100
    };

    constructor(prop: any) {
        super(prop)
        this.state = {
            decodedText: '',
            encodedText: '',
        }

        this.onChangeDecodedTextArea = this.onChangeDecodedTextArea.bind(this)
        this.onChangeEncodedTextArea = this.onChangeEncodedTextArea.bind(this)
        this.onClickUrlEncode = this.onClickUrlEncode.bind(this)
        this.onClickUrlDecode = this.onClickUrlDecode.bind(this)
    }

    render(): ReactNode {
        return (
            <div className={"container"}>
                <div className={"row form-floating"}>
                    <textarea
                        id="floatingTextarea"
                        className={"form-control textarea"}
                        style={this.textAreaStyle}
                        value={this.state.decodedText}
                        onChange={this.onChangeDecodedTextArea}
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
                        id="floatingTextarea"
                        className={"form-control textarea"}
                        style={this.textAreaStyle}
                        value={this.state.encodedText}
                        onChange={this.onChangeEncodedTextArea}
                    />
                    <label htmlFor={"floatingTextarea"}>Please input text you'd like to decode.</label>
                </div>
            </div>
        )
    }

    onChangeDecodedTextArea(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            decodedText: e.target.value
        })
    }

    onChangeEncodedTextArea(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            encodedText: e.target.value
        })
    }

    onClickUrlEncode(e: React.MouseEvent<HTMLElement>) {
        this.setState({
            encodedText: encodeURIComponent(this.state.decodedText)
        })
    }

    onClickUrlDecode(e: React.MouseEvent<HTMLElement>) {
        this.setState({
            decodedText: decodeURIComponent(this.state.encodedText)
        })
    }
}

export default UrlEncodeForm
