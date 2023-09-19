import { FC, PropsWithChildren, useMemo, useReducer } from "react";
import Context, { State, GetStateContext } from "./context";
import reducer from "./reducer";
import useCallbackRef from "hooks/useCallbackRef";

const initialState: State = {
  runningCases: new Set(),
  preloadedJS: "const hello = 'world'",
  preloadedJSError: null,
  testCases: [
    {
      code: "console.log(hello)",
      id: "log",
    },
    {
      code: `let sum = 0
for (let i = 0; i < 1000000; i++) {
  sum += i
}`,
      id: "a",
    },
    {
      code: `let sum = 0
const arr = new Array(1000000).fill(null)
Array.from(arr.keys()).forEach(key => {
  sum += key
})`,
      id: "b",
    },
    {
      code: `const sum = Array.from(new Array(1000000)).reduce((acc, value) => acc + value, 0)`,
      id: "c",
    },
  ],
  testResults: [],
  testErrors: [],
};

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={useMemo(() => ({ state, dispatch }), [state])}>
      <GetStateContext.Provider value={useCallbackRef(() => state)}>
        {children}
      </GetStateContext.Provider>
    </Context.Provider>
  );
};

export default Provider;
