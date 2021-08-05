import React, { ReactNode } from "react";

type State = {
    parsedUrlText: string,
    baseUrlText: string,
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

    constructor(prop: any) {
        super(prop)
        this.state = {
            parsedUrlText: '',
            baseUrlText: '',
            urlParams: [],
        }

        this.onChangeParsedURLText = this.onChangeParsedURLText.bind(this)
        this.onChangeBaseURLText = this.onChangeBaseURLText.bind(this)
        this.onChangeParamsText = this.onChangeParamsText.bind(this)
        this.onClickUrlParse = this.onClickUrlParse.bind(this)
        this.onClickUrlBuild = this.onClickUrlBuild.bind(this)
        this.onClickDeleteParam = this.onClickDeleteParam.bind(this)
        this.onClickAddParam = this.onClickAddParam.bind(this)
    }

    render(): ReactNode {
        return (
            <div className={"container"}>
                <div className={"input-group mb-3"}>
                    <span className={"input-group-text"} id={"parsedUrl"}>Parsed URL</span>
                    <input type={"url"} className={"form-control"} aria-describedby={"parsedUrl"} value={this.state.parsedUrlText} onChange={this.onChangeParsedURLText} />
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
                        <input type={"url"} className={"form-control"} aria-describedby={"baseUrl"} value={this.state.baseUrlText} onChange={this.onChangeBaseURLText} />
                    </div>
                    <table className={"table table-sm"}>
                        <thead>
                            <tr>
                                <th scope={"col"}>URL PARAM KEY</th>
                                <th scope={"col"}>URL PARAM VALUE</th>
                                <th scope={"col"}>DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.urlParamsTbodyTr()}
                        </tbody>
                    </table>
                    <div style={this.styles.addParamButton}>
                        <button type={"button"} className={"btn btn-secondary"} onClick={this.onClickAddParam}>add param</button>
                    </div>
                </div>
            </div>
        )
    }

    urlParamsTbodyTr(): ReactNode {
        return this.state.urlParams.map((urlParam: UrlParam, i: number) => {
            return (
                <tr key={i}>
                    <td><input type={"text"} className={"form-control"} value={this.state.urlParams[i].key} data-index={i} data-type={"key"} onChange={this.onChangeParamsText} /></td>
                    <td><input type={"text"} className={"form-control"} value={this.state.urlParams[i].value} data-index={i} data-type={"value"} onChange={this.onChangeParamsText} /></td>
                    <td><button type={"button"} className={"btn btn-secondary btn-sm"} onClick={this.onClickDeleteParam} data-index={i}>delete</button></td>
                </tr>
            )
        })
    }

    onChangeParsedURLText(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            parsedUrlText: e.target.value
        })
    }

    onChangeBaseURLText(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            baseUrlText: e.target.value
        })
    }

    onChangeParamsText(e: React.ChangeEvent<HTMLInputElement>) {
        const newUrlParams = Array.from(this.state.urlParams)
        const index = Number(e.currentTarget.getAttribute('data-index'))
        const type = e.currentTarget.getAttribute('data-type')
        newUrlParams[index][type] = e.target.value
        this.setState({
            urlParams: newUrlParams,
        })
    }

    onClickUrlParse(e: React.MouseEvent<HTMLElement>) {
        const parsedUrl = new URL(this.state.parsedUrlText)

        const urlParams: UrlParam[] = []
        parsedUrl.searchParams.forEach(((value: string, key: string, parent: URLSearchParams) => {
            urlParams.push({ key: key, value: value })
        }))

        this.setState({
            baseUrlText: `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`,
            urlParams: urlParams,
        })
    }

    onClickUrlBuild(e: React.MouseEvent<HTMLElement>) {
        const params = this.state.urlParams
            .map((urlParam: UrlParam) => {
                const encodedValue = encodeURIComponent(urlParam.value)
                return `${urlParam.key}=${encodedValue}`
            })
            .join('&')

        this.setState({
            parsedUrlText: `${this.state.baseUrlText}?${params}`
        })
    }

    onClickDeleteParam(e: React.MouseEvent<HTMLElement>) {
        const clickButtonIndex = e.currentTarget.getAttribute('data-index')
        const newUrlParams = this.state.urlParams.filter((urlParam: UrlParam, index: number) => clickButtonIndex != index.toString())
        this.setState({
            urlParams: newUrlParams,
        })
    }

    onClickAddParam(e: React.MouseEvent<HTMLElement>) {
        const newUrlParams = Array.from(this.state.urlParams)
        newUrlParams.push({ key: '', value: '' })
        this.setState({
            urlParams: newUrlParams,
        })
    }
}

export default UrlParseForm
