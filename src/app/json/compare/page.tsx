import type {Metadata} from 'next';
import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame';
import JSONCompareForm from '@/components/molecules/JSONCompareForm/JSONCompareForm';
import React from 'react';

export const metadata: Metadata = {
  title: 'Developer Help Tool - JSON Compare Tool',
};

const JSONCompare = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle={'JSON Compare Tool'}
      content={<JSONCompareForm />}
    />
  );
};

export default JSONCompare;
