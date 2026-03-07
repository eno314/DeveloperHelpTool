import type {Metadata} from 'next';
import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame';
import JSONEncodeForm from '@/components/molecules/JSONParseForm/JSONParseForm';
import React from 'react';

export const metadata: Metadata = {
  title: 'Developer Help Tool - JSON Parse Tool',
};

const JSONEncode = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle={'JSON Parse Tool'}
      content={<JSONEncodeForm />}
    />
  );
};

export default JSONEncode;
