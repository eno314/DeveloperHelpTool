import React, { ReactNode } from "react";

type State = {
    linkURLText : string,
    links: Link[],
}

type Link = {
    url: string
}


class LinkCreateForm extends React.Component<{}, State> {

    constructor(prop: any) {
        super(prop)
        this.state = {
            linkURLText: '',
            links: []
        }

        this.linkList = this.linkList.bind(this)
        this.onChangeLinkURLText = this.onChangeLinkURLText.bind(this)
        this.onClickAddLink = this.onClickAddLink.bind(this)
    }

    render(): ReactNode {
        return (
            <div className={"container"}>
                <div className={"input-group mb-3"}>
                    <span className={"input-group-text"} id={"linkURL"}>Link URL</span>
                    <input type={"url"} className={"form-control"} aria-describedby={"linkURL"} value={this.state.linkURLText} onChange={this.onChangeLinkURLText} />
                </div>
                <div className={"row"}>
                    <div className={"col text-center"}>
                        <button type={"button"} className={"btn btn-primary"} onClick={this.onClickAddLink}>▼ Add Link</button>
                    </div>
                </div>
                <div className={"list-group"}>
                    {this.linkList()}
                </div>
            </div>
        )
    }

    linkList(): ReactNode {
        return this.state.links.map((link: Link, i: number) => {
            return (
                <a
                    key={i}
                    className={"list-group-item list-group-item-action"}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={link.url}>
                    {link.url}
                </a>
            )
        })
    }

    onChangeLinkURLText(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            linkURLText: e.target.value
        })
    }

    onClickAddLink(e: React.MouseEvent<HTMLElement>) {
        const newLinks = Array.from(this.state.links)
        const inputURL = this.state.linkURLText

        newLinks.push({ url: inputURL })

        this.setState({
            links: newLinks,
        })
    }
}

export default LinkCreateForm
