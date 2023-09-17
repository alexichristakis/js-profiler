import RpcRegistry from "rpc/registry";
import { HostMethods, HostRPCMethodConfigs } from "./types";
import { v4 } from "uuid";

declare const self: DedicatedWorkerGlobalScope;
export default {} as typeof Worker & { new (): Worker };

export type Payload = {
  id: string;
  method: HostMethods["method"];
  args: HostMethods["arguments"];
};

const makeRandomVariableName = () => `$${v4()}`.replaceAll("-", "");

const rpcRegistry = new RpcRegistry<HostRPCMethodConfigs>({
  abort: () => {},
  run: async ({ preloadedJS, code, time }) => {
    const accumulatedRunTimeVariableName = makeRandomVariableName();
    const timesVariableName = makeRandomVariableName();
    const timeVariableName = makeRandomVariableName();
    const iterationStartTimeVariableName = makeRandomVariableName();

    // eslint-disable-next-line no-new-func
    const run = new Function(
      timeVariableName,
      `
      return (async () => {
          try {
            ${preloadedJS}
            const ${timesVariableName} = []
            let ${accumulatedRunTimeVariableName} = 0;
            while (${accumulatedRunTimeVariableName} < ${timeVariableName}) {
              const ${iterationStartTimeVariableName} = performance.now();
              try {
                ${code.trim()}
              } catch (err) {
                return { status: 'error', runError: err }
              } finally {
                // we're in a separate closure here so iterationTime doesn't need to be hashed
                const iterationTime = performance.now() - ${iterationStartTimeVariableName};
                ${timesVariableName}.push(iterationTime);
                ${accumulatedRunTimeVariableName} += iterationTime;
              }
            }

            return { status: 'success', times: ${timesVariableName} }
          } catch (err) {
            return { status: 'error', preloadedJSError: err }
          }
        })()
      `
    );

    const startTime = performance.now();
    const { status, times, runError, preloadedJSError } = await run(time);
    console.log(performance.now() - startTime);

    if (status === "error") {
      return { error: { runError, preloadedJSError } };
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
