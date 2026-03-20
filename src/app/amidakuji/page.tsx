import React from "react";
import type { Metadata } from "next";
import DeveloperHelpToolFrame from "../../components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame.tsx";
import Amidakuji from "../../components/organisms/Amidakuji/Amidakuji.tsx";

export const metadata: Metadata = {
  title: "Developer Help Tool - Amidakuji Tool",
};

const AmidakujiPage = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle="Amidakuji Tool"
      content={<Amidakuji />}
    />
  );
};

export default AmidakujiPage;
