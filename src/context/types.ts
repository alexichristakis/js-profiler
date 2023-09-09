import { Dispatch } from "react";

export type TestCase = { id: string; code: string };

export type TestResult = {
  id: string;
  progress: number;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
};

export type AddTestCaseAction = {
  type: "ADD_CASE";
};

export type EditTestCaseAction = {
  type: "EDIT_CASE";
  testCase: TestCase;
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
  times: number[];
  progress: number;
  id: string;
};

export type Action =
  | AddTestCaseAction
  | EditTestCaseAction
  | DeleteTestCaseAction
  | ToggleRunningAction
  | ReceiveResultsAction
  | StopAllAction;

export type SelectedToolDispatch = Dispatch<AddTestCaseAction>;
