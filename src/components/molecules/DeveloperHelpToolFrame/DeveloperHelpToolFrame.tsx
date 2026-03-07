import React from 'react';

interface Props {
  subTitle: string;
  content: React.ReactNode;
}

const DeveloperHelpToolFrame = (props: Props): React.JSX.Element => {
  return (
    <div>
      <main>
        <h1 className={'col text-center'}>Developer Help Tool</h1>
        <h2 className={'col text-center'}>{props.subTitle}</h2>
        {props.content}
      </main>
    </div>
  );
};

export default DeveloperHelpToolFrame;
