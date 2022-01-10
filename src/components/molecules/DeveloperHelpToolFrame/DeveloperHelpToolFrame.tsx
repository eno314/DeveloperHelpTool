import Head from "next/head";
import React from "react";

type Props = {
    subTitle: string;
    content: React.ReactNode
}

const DeveloperHelpToolFrame = (({ subTitle, content }: Props) => {
    return (
        <div>
            <Head>
                <title>Developer Help Tool - {subTitle}</title>
            </Head>

            <main>
                <h1 className={"col text-center"}>Developer Help Tool</h1>
                <h2 className={"col text-center"}>{subTitle}</h2>
                {content}
            </main>
        </div>
    )
})

export default DeveloperHelpToolFrame
