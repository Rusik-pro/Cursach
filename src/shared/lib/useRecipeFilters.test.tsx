import { renderHook, act } from '@testing-library/react';
import { useRecipeFilters } from '@/shared/lib/useRecipeFilters';

describe('useRecipeFilters', () => {
  it('starts with empty filters', () => {
    const { result } = renderHook(() => useRecipeFilters());
    expect(result.current.filters).toEqual({});
  });

  it('includes debounced search in filters', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useRecipeFilters());
    act(() => {
      result.current.setQ('борщ');
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.filters.q).toBe('борщ');
    jest.useRealTimers();
  });
});
