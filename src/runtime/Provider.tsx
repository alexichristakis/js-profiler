import { FC, PropsWithChildren, useMemo } from "react";
import Context from "./context";
import useRuntime from "./useRuntime";

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const { run, abort } = useRuntime();

  return (
    <Context.Provider value={useMemo(() => ({ run, abort }), [run, abort])}>
      {children}
    </Context.Provider>
  );
};

export default Provider;
