import type { Metadata } from "next";
import DeveloperHelpToolFrame from "../../../components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame.tsx";
import StringReplaceForm from "../../../components/molecules/StringReplaceForm/StringReplaceForm.tsx";
import React from "react";

export const metadata: Metadata = {
  title: "Developer Help Tool - String Replace Tool",
};

const StringReplace = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle="String Replace Tool"
      content={<StringReplaceForm />}
    />
  );
};

export default StringReplace;
