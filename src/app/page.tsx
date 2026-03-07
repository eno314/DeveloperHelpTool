import type {Metadata} from 'next';
import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame';
import ToolList from '@/components/molecules/ToolList/ToolList';
import React from 'react';

export const metadata: Metadata = {
  title: 'Developer Help Tool - index page',
};

const links = [
  {
    linkPath: '/json/parse',
    title: 'JSON Parse Tool',
    description: 'You can parse JSON by this tool.',
  },
  {
    linkPath: '/string/replace',
    title: 'String Replace Tool',
    description: 'You can replace string by this tool.',
  },
  {
    linkPath: '/url/encode',
    title: 'Url Encode And Decode Tool',
    description: 'You can encode and decode url by this tool.',
  },
  {
    linkPath: '/url/parse',
    title: 'Url Parse Tool',
    description: 'You can parse and build url by this tool.',
  },
];

const Home = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle={'index page'}
      content={<ToolList toolList={links} />}
    />
  );
};

export default Home;
