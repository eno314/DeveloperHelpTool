import React from 'react';
import type {Metadata} from 'next';
import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame';
import Amidakuji from '@/components/organisms/Amidakuji/Amidakuji';

export const metadata: Metadata = {
  title: 'Developer Help Tool - Amidakuji Tool',
};

const AmidakujiPage = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle={'Amidakuji Tool'}
      content={<Amidakuji />}
    />
  );
};

export default AmidakujiPage;
