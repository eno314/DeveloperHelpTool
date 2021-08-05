import React, { ReactNode } from "react";

type Props = {
    subTitle: string;
}

class DeveloperHelpToolHeader extends React.Component<Props, {}> {

    render(): ReactNode {
        return (
            <div>
                <h1 className={"col text-center"}>Developer Help Tool</h1>
                <h2 className={"col text-center"}>{this.props.subTitle}</h2>
            </div>
        )
    }
}

export default DeveloperHelpToolHeader
