import { useContext } from "react";
import RuntimeContext from "./context";

const useRuntimeContext = () => {
  const value = useContext(RuntimeContext);

  if (!value) {
    throw new Error("");
  }

  return value;
};

export default useRuntimeContext;
