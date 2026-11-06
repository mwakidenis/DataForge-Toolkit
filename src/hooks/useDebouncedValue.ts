// ============================================================================
// DataForge Toolkit — Local Hook: useDebouncedValue
// Inlined from @mwakidenis/logx-react for self-contained builds
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    cancel();
    timer.current = setTimeout(() => {
      setDebounced(value);
      timer.current = null;
    }, delay);
    return cancel;
  }, [value, delay, cancel]);

  useEffect(() => cancel, [cancel]);

  return debounced;
}
