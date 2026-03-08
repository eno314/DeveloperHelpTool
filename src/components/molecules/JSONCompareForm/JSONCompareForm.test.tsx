import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import JSONCompareForm from './JSONCompareForm';
import '@testing-library/jest-dom';

describe('JSONCompareForm', () => {
  it('renders input areas and compare button', () => {
    render(<JSONCompareForm />);
    expect(screen.getByLabelText('Left JSON')).toBeInTheDocument();
    expect(screen.getByLabelText('Right JSON')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Compare'})).toBeInTheDocument();
  });

  it('displays an error if the left JSON is invalid', () => {
    render(<JSONCompareForm />);
    const leftTextarea = screen.getByLabelText('Left JSON');
    const compareButton = screen.getByRole('button', {name: 'Compare'});

    fireEvent.change(leftTextarea, {target: {value: 'invalid json'}});
    fireEvent.click(compareButton);

    expect(screen.getByText('Left JSON is invalid.')).toBeInTheDocument();
  });

  it('displays an error if the right JSON is invalid', () => {
    render(<JSONCompareForm />);
    const leftTextarea = screen.getByLabelText('Left JSON');
    const rightTextarea = screen.getByLabelText('Right JSON');
    const compareButton = screen.getByRole('button', {name: 'Compare'});

    fireEvent.change(leftTextarea, {target: {value: '{"valid": true}'}});
    fireEvent.change(rightTextarea, {target: {value: 'invalid json'}});
    fireEvent.click(compareButton);

    expect(screen.getByText('Right JSON is invalid.')).toBeInTheDocument();
  });

  it('displays diff results correctly for valid JSONs', () => {
    render(<JSONCompareForm />);
    const leftTextarea = screen.getByLabelText('Left JSON');
    const rightTextarea = screen.getByLabelText('Right JSON');
    const compareButton = screen.getByRole('button', {name: 'Compare'});

    fireEvent.change(leftTextarea, {
      target: {value: '{"name": "John", "age": 30}'},
    });
    fireEvent.change(rightTextarea, {
      target: {value: '{"name": "John", "age": 31, "city": "New York"}'},
    });
    fireEvent.click(compareButton);

    expect(screen.getByText('Left Result')).toBeInTheDocument();
    expect(screen.getByText('Right Result')).toBeInTheDocument();

    // Just check if parts of the formatted JSON appear in the DOM
    expect(screen.getAllByText(/"name": "John",/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"age": 30/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"age": 31,/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/"city": "New York"/)[0]).toBeInTheDocument();
  });
});
