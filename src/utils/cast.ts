export type UnknownObject = Record<string, unknown>;

export const toObject = (value: unknown): UnknownObject => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as UnknownObject;
  }

  return {};
};

export const toString = (value: unknown): string => {
  return String(value || "");
};
