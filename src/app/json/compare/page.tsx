import type { Metadata } from "next";
import DeveloperHelpToolFrame from "../../../components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame.tsx";
import JSONCompareForm from "../../../components/molecules/JSONCompareForm/JSONCompareForm.tsx";
import React from "react";

export const metadata: Metadata = {
  title: "Developer Help Tool - JSON Compare Tool",
};

const JSONCompare = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle="JSON Compare Tool"
      content={<JSONCompareForm />}
    />
  );
};

export default JSONCompare;
