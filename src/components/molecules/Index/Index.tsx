import React from "react";
import Link from 'next/link'

const links = [
    {
        path: '/string/replace',
        title: 'String Replace Tool',
        description: 'You can replace string by this tool.',
    },
    {
        path: '/url/encode',
        title: 'Url Encode And Decode Tool',
        description: 'You can encode and decode url by this tool.',
    },
    {
        path: '/url/parse',
        title: 'Url Parse Tool',
        description: 'You can parse and build url by this tool.',
    },
]

const Index = () => <div className={"list-group"}>{linkList()}</div>

const linkList = () => links.map((link) => {
    return (
        <Link href={link.path}>
            <a className={"list-group-item list-group-item-action"}>
                <div className={"d-flex justify-content-between"}>
                    <h5 className="mb-1">{link.title}</h5>
                </div>
                <p className="mb-1">{link.description}</p>
            </a>
        </Link>
    )
})

export default Index
