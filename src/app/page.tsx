import type { Metadata } from "next";
import DeveloperHelpToolFrame from "../components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame.tsx";
import ToolList from "../components/molecules/ToolList/ToolList.tsx";
import React from "react";

export const metadata: Metadata = {
  title: "Developer Help Tool - index page",
};

const links = [
  {
    linkPath: "/json/compare",
    title: "JSON Compare Tool",
    description: "You can compare two JSONs by this tool.",
  },
  {
    linkPath: "/string/replace",
    title: "String Replace Tool",
    description: "You can replace string by this tool.",
  },
  {
    linkPath: "/encodeDecode",
    title: "Encode And Decode Tool",
    description: "You can encode and decode url or base64 by this tool.",
  },
  {
    linkPath: "/url/parse",
    title: "Url Parse Tool",
    description: "You can parse and build url by this tool.",
  },
  {
    linkPath: "/amidakuji",
    title: "Amidakuji Tool",
    description: "You can play Amidakuji (Ghost Leg) by this tool.",
  },
  {
    linkPath: "/curl/builder",
    title: "Curl Builder Tool",
    description: "You can build curl command by this tool.",
  },
  {
    linkPath: "/timestamp",
    title: "Timestamp Tool",
    description: "You can check current time and unix timestamp by this tool.",
  },
];

const Home = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle="index page"
      content={<ToolList toolList={links} />}
    />
  );
};

export default Home;
