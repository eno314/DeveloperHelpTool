import React, { ReactNode } from "react";

class UrlParseForm extends React.Component {

    private readonly styles = {
        primaryButtonsRow: {
            marginTop: 10,
            marginBottom: 10,
        },
        addParamButton: {
            textAlign: 'center',
        },
    };

    private readonly parsedUrlText = React.createRef<HTMLInputElement>()
    private readonly parseResultBaseUrlText = React.createRef<HTMLInputElement>()

    constructor(prop: any) {
        super(prop)

        this.onClickUrlParse = this.onClickUrlParse.bind(this)
        this.onClickUrlBuild = this.onClickUrlBuild.bind(this)
    }

    render(): ReactNode {
        return (
            <div className={"container"}>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="parsedUrl">Parsed URL</span>
                    <input ref={this.parsedUrlText} type={"url"} className="form-control" aria-describedby="parsedUrl" />
                </div>
                <div className={"row"} style={this.styles.primaryButtonsRow}>
                    <div className={"col text-center"}>
                        <button type={"button"} className={"btn btn-primary"} onClick={this.onClickUrlParse}>▼ Parse URL</button>
                    </div>
                    <div className={"col text-center"}>
                        <button type={"button"} className={"btn btn-primary"} onClick={this.onClickUrlBuild}>▲ Build URL</button>
                    </div>
                </div>
                <div>
                    <div className={"input-group mb-3"}>
                        <span className="input-group-text" id="baseUrl">Base URL</span>
                        <input ref={this.parseResultBaseUrlText} type={"url"} className="form-control" aria-describedby="baseUrl" />
                    </div>
                    <table className={"table table-sm"}>
                        <thead>
                            <tr>
                                <th scope={"col"}>URL PARAMS KEY</th>
                                <th scope={"col"}>URL PARAMS VALUE</th>
                                <th scope={"col"}>DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type={"text"} defaultValue={"hoge"} /></td>
                                <td><input type={"text"} defaultValue={"fuga"} /></td>
                                <td><button type={"button"} className={"btn btn-secondary btn-sm"}>delete</button></td>
                            </tr>
                            <tr>
                                <td><input type={"text"} defaultValue={"hoge"} /></td>
                                <td><input type={"text"} defaultValue={"fuga"} /></td>
                                <td><button type={"button"} className={"btn btn-secondary btn-sm"}>delete</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={this.styles.addParamButton}>
                        <button type={"button"} className={"btn btn-secondary"}>add param</button>
                    </div>
                </div>
            </div>
        )
    }

    onClickUrlParse(e: React.MouseEvent<HTMLElement>) {
        console.log(this.parsedUrlText.current.value)
    }

    onClickUrlBuild(e: React.MouseEvent<HTMLElement>) {
    }
}

export default UrlParseForm
