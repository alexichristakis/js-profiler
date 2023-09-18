import { v4 } from "uuid";
import Worker, { Payload } from "./worker/languageServer.worker";
import {
  AutocompleteArgs,
  HostMethods,
  HostRPCMethodConfigs,
} from "./worker/types";

class LanguageServerManager {
  private worker: Worker | null = null;
  private messages: Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (err: unknown) => void;
    }
  > = new Map();

  constructor() {
    this.worker = new Worker();
    this.worker.onmessage = this.onMessage;
  }

  private postMessage = <T extends HostMethods["method"]>(
    method: T,
    args: Parameters<HostRPCMethodConfigs[T]>[0]
  ): Promise<ReturnType<HostRPCMethodConfigs[T]>> => {
    const id = v4();
    return new Promise((resolve, reject) => {
      this.messages.set(id, {
        // @ts-expect-error
        resolve,
        reject,
      });

      this.worker?.postMessage({ method, args, id });
    });
  };

  private onMessage = (
    e: MessageEvent<{ id: string; response: HostMethods["response"] }>
  ) => {
    const { id, response } = e.data;
    this.messages.get(id)?.resolve(response);
  };

  updateFile = (fileId: string, file: string) => {
    return this.postMessage("updateFile", { fileId, file });
  };

  getLintDiagnostics = async (fileId: string) => {
    //
  };

  getAutocompleteResults = async (args: AutocompleteArgs) => {
    return this.postMessage("autocomplete", args);
  };

  getQuickInfo = async (fileId: string, pos: number) => {
    return this.postMessage("info", { fileId, pos });
  };
}

export default LanguageServerManager;
