import React, { ReactNode } from "react";
import Link from 'next/link'

class Index extends React.Component {

    render(): ReactNode {
        return (
            <div className={"list-group"}>
                <Link href="/url/parse">
                    <a className={"list-group-item list-group-item-action"}>
                        <div className={"d-flex justify-content-between"}>
                            <h5 className="mb-1">Url Parse Tool</h5>
                        </div>
                        <p className="mb-1">You can parse and build url by this tool.</p>
                    </a>
                </Link>
                <Link href="/url/encode">
                    <a className={"list-group-item list-group-item-action"}>
                        <div className={"d-flex justify-content-between"}>
                            <h5 className="mb-1">Url Encode And Decode Tool</h5>
                        </div>
                        <p className="mb-1">You can encode and decode url by this tool.</p>
                    </a>
                </Link>
            </div>
        )
    }
}

export default Index
