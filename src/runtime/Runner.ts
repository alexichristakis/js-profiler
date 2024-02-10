import { v4 } from "uuid";
import Worker, { Payload } from "./runner.worker";
import { HostMethods, ReportTimes } from "./types";

const STEP_TIME = 250;

class Runner {
  private abortSignal: AbortSignal;
  private worker: Worker | null = null;
  private code = "";
  private preloadedJS = "";
  private heartbeatTimeout: number | null = null;
  private reportTimes: ReportTimes;
  private messages: Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (err: unknown) => void;
    }
  > = new Map();
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

  private postMessage = (message: Omit<Payload, "id">) => {
    const id = v4();
    return new Promise((resolve, reject) => {
      this.messages.set(id, { resolve, reject });
      this.worker?.postMessage({ id, ...message });
    });
  };

  private onMessage = (
    e: MessageEvent<{ id: string; response: HostMethods["response"] }>
  ) => {
    const { id, response } = e.data;
    this.messages.get(id)?.resolve(response);
    this.messages.delete(id);

    const maxIterations = this.iterations ?? 0;
    const progress = 1; // (maxIterations - this.messages.size) / maxIterations;

    console.log({ maxIterations, size: this.messages.size, progress });

    if (response && "error" in response) {
      this.abort();
      const { error } = response;
      this.promise?.reject(error);
      return;
    } else if (response) {
      const { minTime, iterations } = response;
      console.log({ minTime });
      const hz = STEP_TIME / minTime;
      this.reportTimes({ minTime, hz, iterations, progress });
    }

    if (this.messages.size === 0) {
      this.promise?.resolve({});
    }
  };

  abort = () => {
    this.postMessage({ method: "abort", args: undefined });
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
    const numIterations = 1; // time / STEP_TIME;

    this.iterations = numIterations;

    return new Promise(async (resolve, reject) => {
      this.promise = { resolve, reject };
      this.heartbeat();

      for (let i = 0; i < numIterations; i++) {
        await this.postMessage({
          method: "run",
          args: {
            preloadedJS: this.preloadedJS,
            code: this.code,
            time: STEP_TIME,
          },
        });
      }
    });
  };
}

export default Runner;
