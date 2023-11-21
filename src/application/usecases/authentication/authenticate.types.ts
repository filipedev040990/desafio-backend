
export interface AuthenticateUseCaseInterface {
  execute: (input: AuthenticateUseCaseInterface.Input) => Promise<AuthenticateUseCaseInterface.Output>
}

export namespace AuthenticateUseCaseInterface {
  export type Input = {
    email: string
    password: string
  }

  export type Output = {
    token: string
  }
}
