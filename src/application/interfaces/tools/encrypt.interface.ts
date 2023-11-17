export interface HasherInterface {
  hash: (value: string) => Promise<string>
}
