import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import JSONCompareForm from './JSONCompareForm';
import '@testing-library/jest-dom';

describe('JSONCompareForm', () => {
  it('renders input areas, file inputs, and compare button', () => {
    render(<JSONCompareForm />);
    expect(screen.getByLabelText('Left JSON')).toBeInTheDocument();
    expect(screen.getByLabelText('Right JSON')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Compare'})).toBeInTheDocument();

    expect(screen.getByLabelText('Upload Left JSON file')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Right JSON file')).toBeInTheDocument();
  });

  it('updates textareas when files are uploaded', () => {
    render(<JSONCompareForm />);

    const leftFileInput = screen.getByLabelText('Upload Left JSON file');
    const rightFileInput = screen.getByLabelText('Upload Right JSON file');
    const leftTextarea = screen.getByLabelText('Left JSON');
    const rightTextarea = screen.getByLabelText('Right JSON');

    const leftContent = '{"left": "value"}';
    const rightContent = '{"right": "value"}';
    const leftFile = new File([leftContent], 'left.json', {
      type: 'application/json',
    });
    const rightFile = new File([rightContent], 'right.json', {
      type: 'application/json',
    });

    Object.defineProperty(leftFileInput, 'files', {value: [leftFile]});
    Object.defineProperty(rightFileInput, 'files', {value: [rightFile]});

    // Setup mock FileReader
    const mockFileReader = {
      readAsText: jest.fn(function (this: FileReader, file: File) {
        if (this.onload) {
          this.onload({
            target: {result: file === leftFile ? leftContent : rightContent},
          } as unknown as ProgressEvent<FileReader>);
        }
      }),
    };
    jest
      .spyOn(window, 'FileReader')
      .mockImplementation(() => mockFileReader as unknown as FileReader);

    // Upload left
    fireEvent.change(leftFileInput);
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(leftFile);
    expect(leftTextarea).toHaveValue(leftContent);

    // Upload right
    fireEvent.change(rightFileInput);
    expect(mockFileReader.readAsText).toHaveBeenCalledWith(rightFile);
    expect(rightTextarea).toHaveValue(rightContent);

    jest.restoreAllMocks();
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
