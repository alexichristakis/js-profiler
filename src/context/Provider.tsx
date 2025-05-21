import { FC, PropsWithChildren, useMemo, useReducer } from "react";
import Context, { State, GetStateContext } from "./context";
import reducer from "./reducer";
import useCallbackRef from "hooks/useCallbackRef";
import { DEFAULT_PRELOADED_JS } from "./constants";

const initialState: State = {
  runningCases: new Set(),
  collapsedCases: new Set(),
  preloadedJS: DEFAULT_PRELOADED_JS,
  preloadedJSError: null,
  testCases: [
    {
      id: "case1",
      title: "for const loop",
      code: '/o/.test("Hello World!");',
    },
    {
      id: "case2",
      title: "forEach loop",
      code: '"Hello World!".indexOf("o") > -1;',
    },
    {
      id: "case3",
      title: "Math.max",
      code: '!!"Hello World!".match(/o/);',
    },
  ],

  // [
  //   {
  //     id: "case1",
  //     title: "for const loop",
  //     code: "let max = -Infinity;\nfor (const num of nums) {\n  if (num > max) {\n    max = num;\n  }\n}",
  //   },
  //   {
  //     id: "case2",
  //     title: "forEach loop",
  //     code: "let max = -Infinity;\nnums.forEach(num => {\n  if (num > max) {\n    max = num;\n  }\n});",
  //   },
  //   {
  //     id: "case3",
  //     title: "Math.max",
  //     code: "Math.max(...nums);",
  //   },
  //   {
  //     id: "case4",
  //     title: "for let loop",
  //     code: "let max = -Infinity;\nfor (let i = 0; i < nums.length; i++) {\n  const num = nums[i];\n  if (num > max) {\n    max = num;\n  }\n}",
  //   },
  //   {
  //     id: "case5",
  //     title: "reduce",
  //     code: "nums.reduce((max, num) => num > max ? num : max, -Infinity);",
  //   },
  // ],
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
