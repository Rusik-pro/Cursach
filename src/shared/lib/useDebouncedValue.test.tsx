import { act, render, screen } from '@testing-library/react';
import { useState, type ReactElement } from 'react';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';

function Probe({ value }: { value: string }): ReactElement {
  const debounced = useDebouncedValue(value, 50);
  return <span data-testid="debounced">{debounced}</span>;
}

function Toggle(): ReactElement {
  const [v, setV] = useState('a');
  const debounced = useDebouncedValue(v, 50);
  return (
    <div>
      <button type="button" onClick={() => setV('b')}>
        go
      </button>
      <span data-testid="debounced">{debounced}</span>
    </div>
  );
}

describe('useDebouncedValue', () => {
  it('returns initial value immediately', () => {
    render(<Probe value="hello" />);
    expect(screen.getByTestId('debounced')).toHaveTextContent('hello');
  });

  it('debounces updates', () => {
    jest.useFakeTimers();
    render(<Toggle />);
    expect(screen.getByTestId('debounced')).toHaveTextContent('a');
    act(() => {
      screen.getByRole('button', { name: 'go' }).click();
    });
    expect(screen.getByTestId('debounced')).toHaveTextContent('a');
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(screen.getByTestId('debounced')).toHaveTextContent('b');
    jest.useRealTimers();
  });
});
