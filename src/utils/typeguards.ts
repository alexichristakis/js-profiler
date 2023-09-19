export function makeAssert<T>(
  check: (value: unknown) => value is T,
  defaultMessage?: string
) {
  return (value: unknown, message?: string): asserts value is T => {
    if (!check(value)) throw new Error(message || defaultMessage);
  };
}

export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return value != null;
};

export const assertIsNotNullish: <T>(
  value: T | null | undefined,
  message: string
) => asserts value is NonNullable<T> = makeAssert(isNotNullish);

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const isPlainObject = (
  value: unknown
): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const valueIsNever = (value: unknown): value is never => true;

export const assertNever: (value: never) => asserts value is never = makeAssert(
  valueIsNever,
  ""
);

export const assertArray: (value: unknown) => asserts value is unknown[] =
  makeAssert(Array.isArray);
