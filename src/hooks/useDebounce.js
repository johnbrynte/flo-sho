import { useCallback, useRef } from 'react';

export default function useDebounce(callback, delay, dependencies) {
  const handler = useRef(null)

  const debouncedCallback = useCallback((...args) => {
    if (handler.current) {
      clearTimeout(handler.current)
    }

    handler.current = setTimeout(() => {
      callback(...args);
    }, delay);


    return () => {
      clearTimeout(handler.current);
    };
  }, [delay, ...(dependencies ?? [])]);

  return debouncedCallback;
}