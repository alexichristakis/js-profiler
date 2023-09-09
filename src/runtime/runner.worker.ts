import RpcRegistry from "rpc/registry";
import { HostMethods, HostRPCMethodConfigs } from "./types";

declare const self: DedicatedWorkerGlobalScope;
export default {} as typeof Worker & { new (): Worker };

export type Payload = {
  id: string;
  method: HostMethods["method"];
  args: HostMethods["arguments"];
};

let aborted = false;

const rpcRegistry = new RpcRegistry<HostRPCMethodConfigs>({
  abort: () => {
    aborted = true;
  },
  run: async ({ code, time }) => {
    aborted = false;

    // const getPreloadedScope = new Function(preloadedJS);

    const times: number[] = [];

    // eslint-disable-next-line no-restricted-syntax, no-with
    const run = new Function(code);
    let accumulatedRunTime = 0;

    while (!aborted && accumulatedRunTime < time) {
      const iterationStartTime = performance.now();

      try {
        run();
      } catch (err) {
        return { err };
      } finally {
        const iterationTime = performance.now() - iterationStartTime;
        times.push(iterationTime);
        accumulatedRunTime += iterationTime;
      }

      // yield the event loop in case the runner has been aborted
      await Promise.resolve();
    }

    return { times };
  },
});

self.addEventListener("message", async (message: MessageEvent<Payload>) => {
  const { data } = message;
  const { method, args, id } = data;
  const response = await rpcRegistry.callMethod(method, args);

  postMessage({ id, response });
});
