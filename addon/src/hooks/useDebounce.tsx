import { useCallback, useRef } from "react";

export function useDebounce() {
  const ref = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    (callback: (...args: any[]) => void, delay: number) => {
      if (ref.current) {
        clearTimeout(ref.current);
      }

      ref.current = setTimeout(() => {
        callback();
      }, delay);
    },
    []
  );

  return { debounce };
}
