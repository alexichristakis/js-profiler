class RpcRegistry<
  T extends {
    [methodName: string]: (args: any) => any;
  }
> {
  constructor(
    private readonly methodConfig: {
      [key in keyof T]: (
        args: Parameters<T[key]>[0]
      ) => ReturnType<T[key]> | Promise<ReturnType<T[key]>>;
    }
  ) {}

  callMethod(
    methodName: keyof T,
    args: Parameters<T[keyof T]>[0]
  ): ReturnType<T[keyof T]> {
    if (this.methodConfig[methodName]) {
      return this.methodConfig[methodName](args) as ReturnType<T[keyof T]>;
    }

    throw new Error(`Invalid method ${methodName as string}`);
  }
}

export default RpcRegistry;
