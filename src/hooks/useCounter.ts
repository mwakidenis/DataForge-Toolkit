// ============================================================================
// DataForge Toolkit — Local Hook: useCounter
// Inlined from @mwakidenis/logx-react for self-contained builds
// ============================================================================

import { useCallback, useState } from "react";

export interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

export function useCounter(initialValue: number = 0, options: UseCounterOptions = {}): {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
} {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, step = 1 } = options;
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + step, max));
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - step, min));
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value: number) => {
    setCount(Math.min(Math.max(value, min), max));
  }, [min, max]);

  return { count, increment, decrement, reset, set };
}
