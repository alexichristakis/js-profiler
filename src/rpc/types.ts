export type RPCMethod = {
  method: string;
  arguments: unknown;
  response: unknown;
};

export type RPCMethodConfigs<T extends RPCMethod> = {
  [V in T["method"]]: T extends { method: V }
    ? (args: T["arguments"]) => T["response"]
    : never;
};
