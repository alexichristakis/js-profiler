import { RPCMethodConfigs } from "rpc/types";

export type TimingData = {
  iterations: number;
  minTime: number;
  progress: number;
};

export type ReportTimes = (timingData: TimingData & { hz: number }) => void;

export type OnReceiveTimes = (id: string, timingData: TimingData) => void;

export type RuntimeError = { preloadedJSError: unknown; runError: unknown };

export type OnReceiveError = (id: string, error: RuntimeError) => void;

export type HostMethods =
  | {
      method: "run";
      arguments: { preloadedJS: string; code: string; time: number };
      response:
        | { minTime: number; iterations: number }
        | { error: RuntimeError };
    }
  | {
      method: "abort";
      arguments: undefined;
      response: void;
    };

export type HostRPCMethodConfigs = RPCMethodConfigs<HostMethods>;
