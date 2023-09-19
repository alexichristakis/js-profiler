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
      title: "for const loop",
      code: "let max = -Infinity;\nfor (const num of nums) {\n  if (num > max) {\n    max = num;\n  }\n}",
      id: "a",
    },
    {
      title: "forEach loop",
      code: "let max = -Infinity;\nnums.forEach(num => {\n  if (num > max) {\n    max = num;\n  }\n});",
      id: "b",
    },
    {
      title: "Math.max",
      code: "Math.max(...nums);",
      id: "c",
    },
    {
      id: "7c28d7c3-80d8-428e-a25d-d1e9ade9b218",
      title: "for let loop",
      code: "let max = -Infinity;\nfor (let i = 0; i < nums.length; i++) {\n  const num = nums[i];\n  if (num > max) {\n    max = num;\n  }\n}",
    },
    {
      id: "2b2f1264-a8f1-4ead-bbad-30f7fe8c73d1",
      title: "reduce",
      code: "nums.reduce((max, num) => num > max ? num : max, -Infinity);",
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
