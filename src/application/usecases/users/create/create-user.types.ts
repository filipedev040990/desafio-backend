export interface CreateUserUseCaseInterface {
  execute: (input: CreateUserUseCaseInterface.Input) => Promise<CreateUserUseCaseInterface.Output>
}

export namespace CreateUserUseCaseInterface {
  export type Input = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    permissions: number []
  }

  export type Output = {
    id: string
  }
}
