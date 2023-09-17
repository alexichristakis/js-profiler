import { v4 } from "uuid";
import { produce } from "immer";
import { State } from "./context";
import { Action } from "./types";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
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
        draft.testCases.push({ id: v4(), code: "// Your code goes here" });
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
        const { testResults } = draft;

        if (progress === 1) {
          draft.runningCases.delete(id);
        }

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

    default: {
      return state;
    }
  }
};

export default reducer;
