import { Dispatch } from "react";
import { createContext } from "use-context-selector";
import {
  Action,
  ExecutionError,
  TestCase,
  TestError,
  TestResult,
} from "./types";

export type State = {
  runningCases: Set<string>;
  collapsedCases: Set<string>;
  preloadedJS: string;
  preloadedJSError: ExecutionError | null;
  testCases: TestCase[];
  testResults: TestResult[];
  testErrors: TestError[];
};

const Context = createContext<{
  dispatch: Dispatch<Action>;
  state: State;
} | null>(null);

export const GetStateContext = createContext<(() => State) | null>(null);

export default Context;
