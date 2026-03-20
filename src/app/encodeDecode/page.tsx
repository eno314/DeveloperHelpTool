import type { Metadata } from "next";
import DeveloperHelpToolFrame from "../../components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame.tsx";
import EncodeDecodeForm from "../../components/molecules/EncodeDecodeForm/EncodeDecodeForm.tsx";
import React from "react";

export const metadata: Metadata = {
  title: "Developer Help Tool - Encode And Decode Tool",
};

const EncodeDecode = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle="Encode And Decode Tool"
      content={<EncodeDecodeForm />}
    />
  );
};

export default EncodeDecode;
