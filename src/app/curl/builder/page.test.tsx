import {render, screen} from '@testing-library/react';
import CurlBuilder from './page';

describe('CurlBuilder page', () => {
  it('renders DeveloperHelpToolFrame and subTitle', () => {
    render(<CurlBuilder />);
    const subTitle = screen.getByText('Curl Builder Tool');
    expect(subTitle).toBeInTheDocument();
  });

  it('renders CurlBuilderForm inside content', () => {
    render(<CurlBuilder />);
    const generatedLabel = screen.getByText('Generated curl Command');
    expect(generatedLabel).toBeInTheDocument();
  });
});
