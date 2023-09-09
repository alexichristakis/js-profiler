import { RPCMethodConfigs } from "rpc/types";

export type ReportTimes = (times: number[], progress: number) => void;

export type OnReceiveTimes = (
  id: string,
  times: number[],
  progress: number
) => void;

export type HostMethods =
  | {
      method: "run";
      arguments: { code: string; time: number };
      response: { times: number[] } | { err: unknown };
    }
  | {
      method: "abort";
      arguments: undefined;
      response: void;
    };

export type HostRPCMethodConfigs = RPCMethodConfigs<HostMethods>;
