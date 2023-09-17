import { RPCMethodConfigs } from "rpc/types";

export type ReportTimes = (times: number[], progress: number) => void;

export type OnReceiveTimes = (
  id: string,
  times: number[],
  progress: number
) => void;

export type RuntimeError = { preloadedJSError: unknown; runError: unknown };

export type OnReceiveError = (id: string, error: RuntimeError) => void;

export type HostMethods =
  | {
      method: "run";
      arguments: { preloadedJS: string; code: string; time: number };
      response: { times: number[] } | { error: RuntimeError };
    }
  | {
      method: "abort";
      arguments: undefined;
      response: void;
    };

export type HostRPCMethodConfigs = RPCMethodConfigs<HostMethods>;
