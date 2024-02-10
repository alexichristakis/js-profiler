import { TestCase } from "context/types";
import Runner from "./Runner";
import { OnReceiveTimes, OnReceiveError, RuntimeError } from "./types";

type Args = {
  onReceiveTimes: OnReceiveTimes;
  onReceiveError: OnReceiveError;
};

type RunArgs = {
  preloadedJS: string;
  testCases: Pick<TestCase, "id" | "code">[];
  abortSignal: AbortSignal;
  /** How long to run the suite for in ms */
  time: number;
};

class Runtime {
  abortSignal: AbortSignal | null = null;
  reportTimes: OnReceiveTimes;
  reportError: OnReceiveError;

  constructor({ onReceiveTimes, onReceiveError }: Args) {
    this.reportTimes = onReceiveTimes;
    this.reportError = onReceiveError;
  }

  run = async ({ preloadedJS, testCases, time, abortSignal }: RunArgs) => {
    const promises: Promise<unknown>[] = [];
    for (const { id, code } of testCases) {
      const runner = new Runner(
        (timingData) => this.reportTimes(id, timingData),
        abortSignal
      );

      runner.init(preloadedJS, code);

      promises.push(
        Promise.resolve().then(async () => {
          try {
            await runner.run(time);
          } catch (error) {
            this.reportError(id, error as RuntimeError);
          }
        })
      );
    }

    return await Promise.allSettled(promises);
  };
}

export default Runtime;
