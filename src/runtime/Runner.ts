import { v4 } from "uuid";
import Worker, { Payload } from "./runner.worker";
import { HostMethods, ReportTimes } from "./types";

class Runner {
  private abortSignal: AbortSignal;
  private worker: Worker | null = null;
  private code = "";
  private preloadedJS = "";
  private heartbeatTimeout: number | null = null;
  private reportTimes: ReportTimes;
  private messageIds: Set<string> = new Set();
  private promise: {
    resolve: (value: unknown) => void;
    reject: (err: unknown) => void;
  } | null = null;
  private iterations: number | null = null;

  constructor(reportTimes: ReportTimes, abortSignal: AbortSignal) {
    this.reportTimes = reportTimes;
    this.abortSignal = abortSignal;
  }

  init = (preloadedJS: string, code: string) => {
    this.abort();

    this.preloadedJS = preloadedJS;
    this.code = code;
    this.worker = new Worker();
    this.worker.onmessage = this.onMessage;
  };

  private postMessage = (message: Payload) => {
    this.worker?.postMessage(message);
  };

  private onMessage = (
    e: MessageEvent<{ id: string; response: HostMethods["response"] }>
  ) => {
    const { id, response } = e.data;
    this.messageIds.delete(id);

    const maxIterations = this.iterations ?? 0;
    const progress = (maxIterations - this.messageIds.size) / maxIterations;

    if (response && "error" in response) {
      this.abort();
      const { error } = response;
      this.promise?.reject(error);
      return;
    } else if (response && "times" in response) {
      const { times } = response;
      this.reportTimes(times, progress);
    }

    if (this.messageIds.size === 0) {
      this.promise?.resolve({});
    }
  };

  abort = () => {
    this.postMessage({ id: v4(), method: "abort", args: undefined });
    this.worker?.terminate();

    if (this.heartbeatTimeout != null) {
      window.clearTimeout(this.heartbeatTimeout);
    }
  };

  private heartbeat = () => {
    this.heartbeatTimeout = window.setTimeout(() => {
      if (this.abortSignal.aborted) {
        this.abort();
      }

      this.heartbeat();
    }, 50);
  };

  run = async (time: number) => {
    const stepTime = 250;
    const numIterations = time / stepTime;

    this.iterations = numIterations;

    return new Promise((resolve, reject) => {
      this.promise = { resolve, reject };
      this.heartbeat();

      for (let i = 0; i < numIterations; i++) {
        const id = v4();
        this.messageIds.add(id);

        this.postMessage({
          id,
          method: "run",
          args: {
            preloadedJS: this.preloadedJS,
            code: this.code,
            time: stepTime,
          },
        });
      }
    });
  };
}

export default Runner;
