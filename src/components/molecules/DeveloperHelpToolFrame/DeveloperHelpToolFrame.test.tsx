/**
 * @jest-environment jsdom
 */

import DeveloperHelpToolFrame from "./DeveloperHelpToolFrame";
import { render, screen } from '@testing-library/react';

jest.mock('next/head', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: Array<React.ReactElement> }) => {
            return <>{children}</>;
        },
    };
});

describe('render', () => {

    const subTitle = 'sub title'
    const content = <div data-testid={"test"}>hoge</div>

    test('DeveloperHelpToolFrame has title', () => {
        render(<DeveloperHelpToolFrame subTitle={subTitle} content={content} />)

        expect(screen.getByText('Developer Help Tool - sub title')).toBeInTheDocument()
    });

    test('DeveloperHelpToolFrame has headings', () => {
        render(<DeveloperHelpToolFrame subTitle={subTitle} content={content} />)

        const headings = screen.getAllByRole('heading')
        expect(headings[0]).toHaveTextContent('Developer Help Tool')
        expect(headings[1]).toHaveTextContent(subTitle)
    });

    test('DeveloperHelpToolFrame has content', () => {
        render(<DeveloperHelpToolFrame subTitle={subTitle} content={content} />)

        expect(screen.getByTestId('test')).toHaveTextContent('hoge')
    });
});
