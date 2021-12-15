import { useEffect, useState } from 'react';

const DEBOUNCE_INTERVAL_INPUT = 500;

const useDebounce = (value: string, delay: number = DEBOUNCE_INTERVAL_INPUT): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
