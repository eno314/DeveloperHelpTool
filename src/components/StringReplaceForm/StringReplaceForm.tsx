import React, { ReactNode } from "react";

type State = {
    replacedStr: string,
    targetSubstr: string,
    newSubstr: string,
    resultStr: string,
}

class StringReplaceForm extends React.Component<{}, State> {

    private readonly styles = {
        textArea: {
            height: 200,
            marginTop: 5,
            marginBottom: 5,
        },
        buttonsRow: {
            marginTop: 5,
            marginBottom: 5,
        }
    }

    constructor(prop: any) {
        super(prop)
        this.state = {
            replacedStr: '',
            targetSubstr: '',
            newSubstr: '',
            resultStr: '',
        }

        this.onChangeReplacedTextarea = this.onChangeReplacedTextarea.bind(this)
        this.onChangeTargetSubstr = this.onChangeTargetSubstr.bind(this)
        this.onChangeNewSubstr = this.onChangeNewSubstr.bind(this)
        this.onChangeResultTextarea = this.onChangeResultTextarea.bind(this)
        this.onClickReplace = this.onClickReplace.bind(this)
    }

    render(): ReactNode {
        return (
            <div className={"container"}>
                <div className={"row form-floating"}>
                    <textarea
                        className={"form-control textarea"}
                        id="replacedTextarea"
                        onChange={this.onChangeReplacedTextarea}
                        style={this.styles.textArea}
                        value={this.state.replacedStr}
                    />
                    <label htmlFor={"replacedTextarea"}>Please input text you'd like to replace.</label>
                </div>
                <div className={"row"} style={this.styles.buttonsRow}>
                    <div className={"input-group mb-3 col"}>
                        <span className={"input-group-text"} id={"targetSubstr"}>target substr</span>
                        <input
                            type={"url"}
                            className={"form-control"}
                            aria-describedby={"targetSubstr"}
                            value={this.state.targetSubstr}
                            onChange={this.onChangeTargetSubstr} />
                    </div>
                    <div className={"input-group mb-3 col"}>
                        <span className={"input-group-text"} id={"newSubstr"}>new substr</span>
                        <input
                            type={"url"}
                            className={"form-control"}
                            aria-describedby={"newSubstr"}
                            value={this.state.newSubstr}
                            onChange={this.onChangeNewSubstr} />
                    </div>
                </div>
                <div className={"row"} style={this.styles.buttonsRow}>
                    <div className={"col text-center"}>
                        <button type={"button"} className={"btn btn-primary"} onClick={this.onClickReplace}>▼ Apply</button>
                    </div>
                </div>
                <div className={"row form-floating"}>
                    <textarea
                        className={"form-control textarea"}
                        id="newTextarea"
                        style={this.styles.textArea}
                        value={this.state.resultStr}
                        onChange={this.onChangeResultTextarea}
                    />
                    <label htmlFor={"newTextarea"}>If you click apply button, replaced string will appear here.</label>
                </div>
            </div>
        )
    }

    onChangeReplacedTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            replacedStr: e.target.value
        })
    }

    onChangeTargetSubstr(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            targetSubstr: e.target.value
        })
    }

    onChangeNewSubstr(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            newSubstr: e.target.value
        })
    }

    onChangeResultTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            resultStr: e.target.value
        })
    }

    onClickReplace(e: React.MouseEvent<HTMLElement>) {
        const replacedStr = this.state.replacedStr
        const targetSubstr = this.state.targetSubstr
        const newSubstr = this.state.newSubstr
        this.setState({
            resultStr: replacedStr.replaceAll(targetSubstr, newSubstr)
        })
    }
}

export default StringReplaceForm
