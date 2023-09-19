import { v4 } from "uuid";
import { produce } from "immer";
import { State } from "./context";
import { Action, ExecutionError } from "./types";
import { assertNever } from "utils/typeguards";
import { toObject, toString } from "utils/cast";

const formatError = (error: unknown): ExecutionError => {
  const { stack, message } = toObject(error);

  return {
    error: toString(stack).split(":")[0] || "Unknown error",
    message: toString(message),
  };
};

const reducer = (state: State, action: Action): State => {
  const { type } = action;
  switch (type) {
    case "STOP_ALL": {
      return produce(state, (draft) => {
        draft.runningCases = new Set();
      });
    }

    case "TOGGLE_RUNNING": {
      const { ids } = action;
      return produce(state, (draft) => {
        for (const id of ids) {
          draft.runningCases.add(id);
        }

        draft.testResults = draft.testResults.filter(
          ({ id }) => !ids.includes(id)
        );
      });
    }

    case "EDIT_PRELOADED_JS": {
      const { preloadedJS } = action;
      return produce(state, (draft) => {
        draft.preloadedJS = preloadedJS;
      });
    }

    case "ADD_CASE": {
      return produce(state, (draft) => {
        draft.testCases.push({
          id: v4(),
          title: `New test case ${draft.testCases.length || ""}`,
          code: "// Your code goes here",
        });
        return draft;
      });
    }

    case "EDIT_CASE": {
      const { testCase } = action;
      return produce(state, (draft) => {
        const oldCase = draft.testCases.find(({ id }) => id === testCase.id);
        if (!oldCase) {
          return draft;
        }

        oldCase.code = testCase.code;
        oldCase.title = testCase.title;

        return draft;
      });
    }

    case "DELETE_CASE": {
      const { id } = action;
      return produce(state, (draft) => {
        draft.testCases = draft.testCases.filter(
          (testCase) => testCase.id !== id
        );

        return draft;
      });
    }

    case "RECEIVE_RESULTS": {
      const { id, times, progress } = action;

      return produce(state, (draft) => {
        const { testResults, testErrors } = draft;

        if (progress === 1) {
          draft.runningCases.delete(id);
        }

        // clear any errors
        draft.testErrors = testErrors.filter((error) => error.id !== id);

        const result = testResults.find((result) => result.id === id);
        if (!result) {
          testResults.push({
            id,
            progress,
            averageTime: 0,
            iterations: times.length,
          });

          return draft;
        }

        const { averageTime, iterations: oldIterations } = result;

        const newIterations = oldIterations + times.length;

        const batchSum = times.reduce((acc, time) => acc + time, 0);
        const newAverageTime =
          (averageTime * oldIterations + batchSum) / newIterations;

        result.progress = progress;
        result.averageTime = newAverageTime;
        result.iterations = newIterations;
      });
    }

    case "RECEIVE_ERROR": {
      const { id, error } = action;
      const { preloadedJSError, runError } = error;

      return produce(state, (draft) => {
        if (preloadedJSError) {
          draft.preloadedJSError = formatError(preloadedJSError);
          return;
        }

        const { testErrors } = draft;
        const existingError = testErrors.find((error) => error.id === id);
        if (!existingError) {
          draft.testErrors.push({ id, error: formatError(runError) });
          return;
        }

        existingError.error = formatError(runError);
      });
    }

    default: {
      assertNever(type);
      return state;
    }
  }
};

export default reducer;
