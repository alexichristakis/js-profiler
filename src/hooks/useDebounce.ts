import { useRef } from "react";

import useCallbackRef from "./useCallbackRef";
import useUnmountEffect from "./useUnmountEffect";

type Fn = () => void;

/**
 * Debounces the provided @param callback function at the specified @param delay.
 *
 * Returns two functions:
 * - a debounced version of "cb"
 * - a function to cancel any pending debounced calls
 */
const useDebounce = (callback: Fn, delay: number): [fn: Fn, cancel: Fn] => {
  const raf = useRef<number>();
  const stableCallback = useCallbackRef(callback);

  const cancel = useCallbackRef(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = undefined;
    }
  });

  useUnmountEffect(() => cancel());

  const tick = useCallbackRef((start: number) => {
    if (Date.now() - start >= delay) {
      stableCallback();
    } else {
      raf.current = requestAnimationFrame(() => tick(start));
    }
  });

  const fn = useCallbackRef(() => {
    cancel();
    tick(Date.now());
  });

  return [fn, cancel];
};

export default useDebounce;
