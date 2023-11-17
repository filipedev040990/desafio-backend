export const isValidString = (value: string): boolean => {
  return value !== undefined && value !== null && value?.trim() !== ''
}
