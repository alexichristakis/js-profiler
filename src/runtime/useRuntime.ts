import useDispatch from "context/useDispatch";
import useGetState from "context/useGetState";
import useCallbackRef from "hooks/useCallbackRef";
import useLanguageServer from "languageServer/useLanguageServer";
import { useRef } from "react";
import Runtime from "runtime/Runtime";
import { v4 } from "uuid";

const useRuntime = () => {
  const dispatch = useDispatch();
  const getState = useGetState();
  const languageServer = useLanguageServer();
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const run = useCallbackRef(async (id?: string) => {
    const { testCases, preloadedJS } = getState();

    const runId = v4();

    const runtime = new Runtime({
      onReceiveTimes: (id, times, progress) => {
        dispatch({ type: "RECEIVE_RESULTS", id, times, progress });
      },
      onReceiveError: (id, error) => {
        dispatch({ type: "RECEIVE_ERROR", id, error });
      },
    });

    const abortController = new AbortController();
    abortControllers.current.set(runId, abortController);

    const { signal: abortSignal } = abortController;

    const testCasesToRun = !id
      ? testCases
      : testCases.filter((testCase) => testCase.id === id);

    const transpiledFiles = await Promise.all(
      testCasesToRun.map(async ({ id }) => ({
        id,
        code: await languageServer.getTranspiledFile(id),
      }))
    );

    console.log(transpiledFiles);

    const idsToRun = testCasesToRun.map(({ id }) => id);
    dispatch({ type: "TOGGLE_RUNNING", ids: idsToRun });

    // run for 10 seconds
    await runtime.run({
      time: 10 * 1000,
      preloadedJS,
      testCases: transpiledFiles,
      abortSignal,
    });

    abortControllers.current.delete(runId);
  });

  const abort = useCallbackRef(() => {
    for (const abortController of abortControllers.current.values()) {
      abortController.abort();
    }

    dispatch({ type: "STOP_ALL" });
  });

  return { run, abort };
};

export default useRuntime;
