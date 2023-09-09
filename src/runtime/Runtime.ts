import { TestCase } from "context/types";
import Runner from "./Runner";
import { OnReceiveTimes } from "./types";

type Args = {
  onReceiveTimes: OnReceiveTimes;
};

type RunArgs = {
  testCases: TestCase[];
  abortSignal: AbortSignal;
  /** How long to run the suite for in ms */
  time: number;
};

class Runtime {
  abortSignal: AbortSignal | null = null;
  reportTimes: OnReceiveTimes;

  constructor({ onReceiveTimes }: Args) {
    this.reportTimes = onReceiveTimes;
  }

  run = async ({ testCases, time, abortSignal }: RunArgs) => {
    const promises: Promise<unknown>[] = [];
    for (const { id, code } of testCases) {
      const runner = new Runner(
        (times, progress) => this.reportTimes(id, times, progress),
        abortSignal
      );

      runner.init(code);
      promises.push(runner.run(time));
    }

    return await Promise.allSettled(promises);
  };
}

export default Runtime;
