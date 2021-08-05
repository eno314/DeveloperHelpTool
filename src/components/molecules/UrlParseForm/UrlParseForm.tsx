import React, { ReactNode } from "react";

type State = {
    urlParams?: UrlParam[],
}

type UrlParam = {
    key: string,
    value: string
}

class UrlParseForm extends React.Component<{}, State> {

    private readonly styles = {
        primaryButtonsRow: {
            marginTop: 10,
            marginBottom: 10,
        },
        addParamButton: {
            textAlign: 'center' as const,
        },
    };

    private readonly parsedUrlText = React.createRef<HTMLInputElement>()
    private readonly baseUrlText = React.createRef<HTMLInputElement>()

    constructor(prop: any) {
        super(prop)
        this.state = {
            urlParams: [],
        }

        this.onClickUrlParse = this.onClickUrlParse.bind(this)
        this.onClickUrlBuild = this.onClickUrlBuild.bind(this)
    }

    render(): ReactNode {
        return (
            <div className={"container"}>
                <div className={"input-group mb-3"}>
                    <span className={"input-group-text"} id={"parsedUrl"}>Parsed URL</span>
                    <input ref={this.parsedUrlText} type={"url"} className={"form-control"} aria-describedby={"parsedUrl"} />
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
                        <span className={"input-group-text"} id={"baseUrl"}>Base URL</span>
                        <input ref={this.baseUrlText} type={"url"} className={"form-control"} aria-describedby={"baseUrl"} />
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
                            {this.urlParamsTbodyTr()}
                        </tbody>
                    </table>
                    <div style={this.styles.addParamButton}>
                        <button type={"button"} className={"btn btn-secondary"}>add param</button>
                    </div>
                </div>
            </div>
        )
    }

    urlParamsTbodyTr(): ReactNode {
        return this.state.urlParams.map((urlParam: UrlParam, i: number) => {
            return (
                <tr key={i}>
                    <td><input type={"text"} defaultValue={urlParam.key} /></td>
                    <td><input type={"text"} defaultValue={urlParam.value} /></td>
                    <td><button type={"button"} className={"btn btn-secondary btn-sm"}>delete</button></td>
                </tr>
            )
        })
    }

    onClickUrlParse(e: React.MouseEvent<HTMLElement>) {
        const parsedUrl = new URL(this.parsedUrlText.current.value)
        this.baseUrlText.current.value = `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`

        const urlParams: UrlParam[] = []
        parsedUrl.searchParams.forEach(((value: string, key: string, parent: URLSearchParams) => {
            urlParams.push({ key: key, value: value })
        }))

        this.setState({
            urlParams: urlParams,
        })
    }

    onClickUrlBuild(e: React.MouseEvent<HTMLElement>) {
    }

    createParamsTr(paramKey: string, paramValue: string): string {
        return
    }
}

export default UrlParseForm
