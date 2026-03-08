import type {Metadata} from 'next';
import DeveloperHelpToolFrame from '@/components/molecules/DeveloperHelpToolFrame/DeveloperHelpToolFrame';
import Base64EncodeForm from '@/components/molecules/Base64EncodeForm/Base64EncodeForm';
import React from 'react';

export const metadata: Metadata = {
  title: 'Developer Help Tool - Base64 Encode And Decode Tool',
};

const Base64Encode = (): React.JSX.Element => {
  return (
    <DeveloperHelpToolFrame
      subTitle={'Base64 Encode And Decode Tool'}
      content={<Base64EncodeForm />}
    />
  );
};

export default Base64Encode;
