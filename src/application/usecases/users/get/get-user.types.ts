import { UserOutput } from '@/application/interfaces/repositories'

export interface GetUserUseCaseInterface {
  execute: (input: GetUserUseCaseInterface.Input) => Promise<GetUserUseCaseInterface.Output>
}

export namespace GetUserUseCaseInterface {
  export type Input = {
    id: string
    authenticatedUser: {
      id: string
      permissions: number []
    }
  }
  export type Output = UserOutput | UserOutput[]
}
