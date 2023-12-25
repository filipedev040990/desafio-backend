export interface UpdateUserUseCaseInterface {
  execute: (input: UpdateUserUseCaseInterface.Input) => Promise<void>
}

export namespace UpdateUserUseCaseInterface {
  export type Input = {
    id: string
    name?: string
    email?: string
    password?: string
    active?: number
    permissions?: number []
  }
}
