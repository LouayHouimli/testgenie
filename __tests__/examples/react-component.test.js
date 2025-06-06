```javascript
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Counter, UserForm } from './components';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Counter Component', () => {
  let onCountChangeMock;

  beforeEach(() => {
    onCountChangeMock = jest.fn();
  });

  it('should render initial value', () => {
    render(<Counter initialValue={5} onCountChange={onCountChangeMock} />);
    expect(screen.getByRole('main')).toHaveTextContent('Counter: 5');
  });

  it('should increment count', () => {
    render(<Counter onCountChange={onCountChangeMock} />);
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByRole('main')).toHaveTextContent('Counter: 1');
    expect(onCountChangeMock).toHaveBeenCalledWith(1);
  });

  it('should decrement count', () => {
    render(<Counter initialValue={5} onCountChange={onCountChangeMock} />);
    fireEvent.click(screen.getByTestId('decrement-btn'));
    expect(screen.getByRole('main')).toHaveTextContent('Counter: 4');
    expect(onCountChangeMock).toHaveBeenCalledWith(4);
  });

  it('should reset count', () => {
    render(<Counter initialValue={5} onCountChange={onCountChangeMock} />);
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('reset-btn'));
    expect(screen.getByRole('main')).toHaveTextContent('Counter: 5');
    expect(onCountChangeMock).toHaveBeenCalledWith(5);
  });

  it('should handle initialValue as 0', () => {
    render(<Counter onCountChange={onCountChangeMock} />);
    expect(screen.getByRole('main')).toHaveTextContent('Counter: 0');
  });

  it('should handle null initialValue', () => {
    render(<Counter initialValue={null} onCountChange={onCountChangeMock} />);
    expect(screen.getByRole('main')).toHaveTextContent('Counter: 0');
  });

  it('should handle undefined initialValue', () => {
    render(<Counter onCountChange={onCountChangeMock} />);
    expect(screen.getByRole('main')).toHaveTextContent('Counter: 0');
  });

  it('should call onCountChange with updated count', () => {
    render(<Counter initialValue={0} onCountChange={onCountChangeMock} />);
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(onCountChangeMock).toHaveBeenCalledWith(1);
  });

  it('should not call onCountChange if not provided', () => {
    const onCountChangeMock = jest.fn();
    render(<Counter initialValue={0}/>);
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(onCountChangeMock).not.toHaveBeenCalled();
  });

});


describe('UserForm Component', () => {
  let onSubmitMock;

  beforeEach(() => {
    onSubmitMock = jest.fn();
  });

  it('should submit form with valid data', () => {
    render(<UserForm onSubmit={onSubmitMock} />);
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmitMock).toHaveBeenCalledWith({ name: 'Test User', email: 'test@example.com', age: '' });
  });

  it('should not submit form with invalid data', () => {
    render(<UserForm onSubmit={onSubmitMock} />);
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmitMock).not.toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith("Name and email are required");
  });

  it('should handle age input', () => {
    render(<UserForm onSubmit={onSubmitMock} />);
    fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '30' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmitMock).toHaveBeenCalledWith({ name: '', email: '', age: '30' });
  });

  it('should handle age input with boundary values', () => {
    render(<UserForm onSubmit={onSubmitMock} />);
    fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmitMock).toHaveBeenCalledWith({ name: '', email: '', age: '0' });
    fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '120' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmitMock).toHaveBeenCalledWith({ name: '', email: '', age: '120' });
  });

  it('should handle age input with invalid values', () => {
    render(<UserForm onSubmit={onSubmitMock} />);
    fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '-1' } });
    expect(screen.getByLabelText('Age:').value).toBe('');
    fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '121' } });
    expect(screen.getByLabelText('Age:').value).toBe('');
  });

  it('should not call onSubmit if not provided', () => {
    render(<UserForm />);
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSubmitMock).not.toHaveBeenCalled();
  });
});

```