interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

const deferred = <T>(): Deferred<T> => {
  const deferred: Partial<Deferred<T>> = {};

  deferred.promise = new Promise<T>((_resolve, _reject) => {
    deferred.resolve = _resolve;
    deferred.reject = _reject;
  });

  return deferred as Deferred<T>;
};

const throttleAsync = <Args extends any[], R>(
  wait: number,
  fn: (...args: Args) => Promise<R>
): ((...args: Args) => Promise<R>) => {
  let timeout: number | undefined;
  let latestArguments: Args;
  let pending: Array<Deferred<R>> = [];

  const startTimeout = () => {
    if (timeout === undefined) {
      timeout = window.setTimeout(performFunctionCall, wait);
    }
  };

  const performFunctionCall = async () => {
    const toResolve = pending;
    pending = [];
    try {
      const result = await fn(...latestArguments);
      toResolve.forEach((p) => p.resolve(result));
    } catch (error) {
      toResolve.forEach((p) => p.reject(error));
    } finally {
      timeout = undefined;
      // Handle calls that were enqueued while we were waiting for our async
      // function.
      if (pending.length) {
        startTimeout();
      }
    }
  };

  return (...args: Args) => {
    latestArguments = args;
    const result = deferred<R>();
    pending.push(result);
    startTimeout();
    return result.promise;
  };
};

export default throttleAsync;
