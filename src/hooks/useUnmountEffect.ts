import { useEffect } from "react";
import useCallbackRef from "./useCallbackRef";

const useUnmountEffect = (_unmountEffect: () => void) => {
  const unmountEffect = useCallbackRef(_unmountEffect);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => unmountEffect, []);
};

export default useUnmountEffect;
