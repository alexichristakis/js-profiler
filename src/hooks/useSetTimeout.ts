import { useRef } from "react";

import useCallbackRef from "./useCallbackRef";
import useUnmountEffect from "./useUnmountEffect";

export type ClearTimeout = () => void;

export type ClearTimeouts = () => void;

export type SetTimeout = (cb: () => void, delay?: number) => ClearTimeout;

type Timeout = number;

/**
 * Hook for registering timeouts that are automatically cleared on unmount.
 *
 * @returns setTimeout function
 */
const useSetTimeout = (): [SetTimeout, ClearTimeouts] => {
  /** Track currently active timeouts */
  const timeouts = useRef(new Set<Timeout>());

  const clearTimeout = useCallbackRef((id: Timeout) => {
    window.clearTimeout(id);
    timeouts.current.delete(id);
  });

  const clearTimeouts = useCallbackRef(() => {
    for (const id of timeouts.current) {
      clearTimeout(id);
    }
  });

  /** On unmount clear all timeouts */
  useUnmountEffect(() => {
    clearTimeouts();
  });

  const setTimeout = useCallbackRef((cb, timeout) => {
    /** Initialize the timeout */
    const id: Timeout = window.setTimeout(() => {
      cb();
      timeouts.current.delete(id);
    }, timeout);

    timeouts.current.add(id);

    /** Return a function to clear the timeout */
    return () => clearTimeout(id);
  });

  return [setTimeout, clearTimeouts];
};

export default useSetTimeout;
