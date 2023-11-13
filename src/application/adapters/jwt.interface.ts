export interface JwtInterface {
  encrypt: (input: any) => Promise<string>
  decrypt: (token: string) => Promise<any>
}
