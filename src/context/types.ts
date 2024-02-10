import { Dispatch } from "react";
import type { RuntimeError, TimingData } from "runtime/types";

export type ExecutionError = {
  error: string;
  message: string;
};

export type TestCase = {
  id: string;
  title: string;
  code: string;
};

export type TestResult = {
  id: string;
  progress: number;
  iterations: number;
  averageTime: number;
};

export type TestError = {
  id: string;
  error: ExecutionError;
};

export type AddTestCaseAction = {
  type: "ADD_CASE";
};

export type EditTestCaseAction = {
  type: "EDIT_CASE";
  testCase: TestCase;
};

export type EditPreloadedJSAction = {
  type: "EDIT_PRELOADED_JS";
  preloadedJS: string;
};

export type DeleteTestCaseAction = {
  type: "DELETE_CASE";
  id: string;
};

export type ToggleRunningAction = {
  type: "TOGGLE_RUNNING";
  ids: string[];
};

export type StopAllAction = {
  type: "STOP_ALL";
};

export type ReceiveResultsAction = {
  type: "RECEIVE_RESULTS";
  id: string;
} & TimingData;

export type ReceiveErrorAction = {
  type: "RECEIVE_ERROR";
  id: string;
  error: RuntimeError;
};

export type ToggleCollapsed = {
  type: "TOGGLE_COLLAPSED";
  id: string;
};

export type Action =
  | AddTestCaseAction
  | EditTestCaseAction
  | DeleteTestCaseAction
  | ToggleRunningAction
  | ReceiveResultsAction
  | StopAllAction
  | EditPreloadedJSAction
  | ReceiveErrorAction
  | ToggleCollapsed;

export type SelectedToolDispatch = Dispatch<AddTestCaseAction>;
