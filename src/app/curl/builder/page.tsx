import type { Metadata } from "next";
import DeveloperHelpToolFrame from "../../../components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame.tsx";
import CurlBuilderForm from "../../../components/organisms/CurlBuilderForm/CurlBuilderForm.tsx";
import React from "react";

export const metadata: Metadata = {
  title: "Developer Help Tool - Curl Builder Tool",
};

const CurlBuilder = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle="Curl Builder Tool"
      content={<CurlBuilderForm />}
    />
  );
};

export default CurlBuilder;
