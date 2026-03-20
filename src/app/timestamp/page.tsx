import type { Metadata } from "next";
import DeveloperHelpToolFrame from "../../components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame.tsx";
import TimestampTool from "../../components/molecules/TimestampTool/TimestampTool.tsx";
import React from "react";

export const metadata: Metadata = {
  title: "Timestamp Tool",
};

const TimestampPage = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle="Timestamp Tool"
      content={<TimestampTool />}
    />
  );
};

export default TimestampPage;
