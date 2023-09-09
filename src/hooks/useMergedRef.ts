import useCallbackRef from "./useCallbackRef";
import type { MutableRefObject, Ref, RefCallback } from "react";

export const mergeRefs =
  <T extends unknown>(...refs: (Ref<T> | undefined)[]): RefCallback<T> =>
  (instance) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        const mutableRef = ref as MutableRefObject<T | null>;
        mutableRef.current = instance;
      }
    });
  };

export const useMergedRef = <T extends unknown>(
  ...refs: (Ref<T> | undefined)[]
): RefCallback<T> => {
  return useCallbackRef(mergeRefs(...refs));
};
