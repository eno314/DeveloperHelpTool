import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Amidakuji from './Amidakuji';
import '@testing-library/jest-dom';

describe('Amidakuji Component', () => {
  it('renders correctly with default values', () => {
    render(<Amidakuji />);
    expect(screen.getByText('Number of Lines (2-15):')).toBeInTheDocument();

    // Check default labels (1 to 5)
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(10); // 5 top, 5 bottom
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[4]).toHaveValue('5');
    expect(inputs[5]).toHaveValue('1');
    expect(inputs[9]).toHaveValue('5');

    // Check generate button
    expect(screen.getByText('生成 (Generate)')).toBeInTheDocument();
  });

  it('updates the number of lines and labels correctly', () => {
    render(<Amidakuji />);
    const numLinesInput = screen.getByLabelText('Number of Lines (2-15):');

    // Change to 3 lines and blur
    fireEvent.change(numLinesInput, {target: {value: '3'}});
    fireEvent.blur(numLinesInput);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6); // 3 top, 3 bottom
    expect(inputs[0]).toHaveValue('1');
    expect(inputs[2]).toHaveValue('3');
    expect(inputs[3]).toHaveValue('1');
    expect(inputs[5]).toHaveValue('3');
  });

  it('generates horizontal lines when clicking Generate', () => {
    render(<Amidakuji />);
    const generateButton = screen.getByText('生成 (Generate)');

    // Before generate, no selection buttons
    expect(screen.queryByText('Select')).not.toBeInTheDocument();

    fireEvent.click(generateButton);

    // After generate, selection buttons appear for top labels
    const selectButtons = screen.getAllByText('Select');
    expect(selectButtons).toHaveLength(5); // 5 top labels
  });

  it('allows editing top and bottom labels', () => {
    render(<Amidakuji />);
    const inputs = screen.getAllByRole('textbox');

    // Edit first top label
    fireEvent.change(inputs[0], {target: {value: 'A'}});
    expect(inputs[0]).toHaveValue('A');

    // Edit first bottom label
    fireEvent.change(inputs[5], {target: {value: 'Win'}});
    expect(inputs[5]).toHaveValue('Win');
  });
});
