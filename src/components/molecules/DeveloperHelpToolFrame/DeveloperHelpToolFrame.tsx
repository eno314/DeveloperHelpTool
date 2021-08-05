import Head from "next/head";
import React, { ReactNode } from "react";

type Props = {
    subTitle: string;
    content: React.ReactNode
}

class DeveloperHelpToolFrame extends React.Component<Props, {}> {

    render(): ReactNode {
        return (
            <div>
                <Head>
                    <title>Developer Help Tool - {this.props.subTitle}</title>
                </Head>

                <main>
                    <h1 className={"col text-center"}>Developer Help Tool</h1>
                    <h2 className={"col text-center"}>{this.props.subTitle}</h2>
                    {this.props.content}
                </main>
            </div>
        )
    }
}

export default DeveloperHelpToolFrame
