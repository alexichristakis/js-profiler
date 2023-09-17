import { Dispatch } from "react";
import { createContext } from "use-context-selector";
import { Action, TestCase, TestResult } from "./types";

export type State = {
  runningCases: Set<string>;
  preloadedJS: string;
  testCases: TestCase[];
  testResults: TestResult[];
};

const Context = createContext<{
  dispatch: Dispatch<Action>;
  state: State;
} | null>(null);

export const GetStateContext = createContext<(() => State) | null>(null);

export default Context;
