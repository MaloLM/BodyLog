import { useState, useCallback } from 'react';

export function useLocalStorage<T extends string>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return (saved as T) ?? defaultValue;
  });

  const setValue = useCallback((value: T) => {
    setState(value);
    localStorage.setItem(key, value);
  }, [key]);

  return [state, setValue];
}

export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean
): [boolean, (value: boolean) => void] {
  const [state, setState] = useState<boolean>(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved === 'true' : defaultValue;
  });

  const setValue = useCallback((value: boolean) => {
    setState(value);
    localStorage.setItem(key, String(value));
  }, [key]);

  return [state, setValue];
}
