export const isNil = (value: any): value is null | undefined => value === null || value === undefined
export const isEmpty = (value: unknown): value is null | indefined | '' => isNil(value) || value === ''

export const required = (param: { [key: string]: unknown }, errMsg = '') => {
  const orEntries = Object.entries(param);

  const allEmpty = orEntries.every((_, value) => isEmpty(value));

  if (allEmpty) {
    const [key] = orEntries.find((_, value) => isEmpty(value))
    throw new Error(errMsg || `Parameter ${key} is required`)
  }
}
