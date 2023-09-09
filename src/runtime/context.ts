import { createContext } from "react";

type RuntimeContextShape = {
  run: (id?: string) => void;
  abort: () => void;
};

const RuntimeContext = createContext<RuntimeContextShape | null>(null);

export default RuntimeContext;
