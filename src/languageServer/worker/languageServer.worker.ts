import LanguageServer from "./languageServer";
import { HostMethods } from "./types";

declare const self: DedicatedWorkerGlobalScope;
export default {} as typeof Worker & { new (): Worker };

export type Payload = {
  id: string;
  method: HostMethods["method"];
  args: HostMethods["arguments"];
};

const languageServer = new LanguageServer();

const messageQueue: MessageEvent<Payload>[] = [];

const processMessage = async (message: MessageEvent<Payload>) => {
  const { data } = message;
  const { method, args, id } = data;
  const response = await languageServer.rpc.callMethod(method, args);
  postMessage({ id, response });
};

const flush = () => {
  messageQueue.map(processMessage);
};

self.addEventListener("message", async (message: MessageEvent<Payload>) => {
  if (!languageServer.isReady) {
    messageQueue.push(message);
  } else {
    flush();
    processMessage(message);
  }
});
