import type {Metadata} from 'next';
import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame';
import UrlEncodeForm from '@/components/molecules/UrlEncodForm/UrlEncodeForm';
import React from 'react';

export const metadata: Metadata = {
  title: 'Developer Help Tool - Url Encode And Decode Tool',
};

const UrlEncode = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle={'Url Encode And Decode Tool'}
      content={<UrlEncodeForm />}
    />
  );
};

export default UrlEncode;
