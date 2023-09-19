import { State } from "./context";

export const resultsSelector = ({ testResults }: State, id: string) =>
  testResults.find((result) => result.id === id);

export const progressSelector = (state: State, id: string) =>
  resultsSelector(state, id)?.progress;
