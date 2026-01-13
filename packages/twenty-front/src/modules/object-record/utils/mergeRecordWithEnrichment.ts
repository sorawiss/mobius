const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isEmptyValue = (value: unknown) => {
  if (value === '' || value === undefined || value === null) {
    return true;
  }

  if (isRecord(value)) {
    return Object.values(value).every(isEmptyValue);
  }

  return false;
};

const cloneRecord = <T>(value: T): T => {
  if (typeof globalThis.structuredClone === 'function') {
    try {
      return globalThis.structuredClone(value);
    } catch {
      // ignore and fallback
    }
  }

  return JSON.parse(JSON.stringify(value));
};

const mergeObjects = (
  target: Record<string, any>,
  source: Record<string, any>,
) => {
  Object.entries(source).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      if (isEmptyValue(target[key])) {
        target[key] = value;
      }
      return;
    }

    if (isRecord(value)) {
      if (!isRecord(target[key])) {
        target[key] = cloneRecord(value);
        return;
      }
      mergeObjects(target[key], value);
      return;
    }

    if (isEmptyValue(target[key])) {
      target[key] = value;
    }
  });
};

export const mergeRecordWithEnrichment = <
  TRecord extends Record<string, any>,
>(
  baseRecordInput: TRecord,
  enrichment: Record<string, any> | null,
): TRecord => {
  if (!enrichment) {
    return baseRecordInput;
  }

  const nextRecord = cloneRecord(baseRecordInput);
  mergeObjects(nextRecord, enrichment);
  return nextRecord;
};
