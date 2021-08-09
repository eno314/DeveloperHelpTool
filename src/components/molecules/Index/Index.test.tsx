/**
 * @jest-environment jsdom
 */

import Index from "./Index";
import { render, screen } from '@testing-library/react';

describe('Index', () => {
    test('renders Index component', () => {
        render(<Index />);
        expect(screen.getAllByRole("link")).toHaveLength(2);
    });
});
