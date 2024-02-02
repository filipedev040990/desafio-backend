import { UserOutput } from '@/application/interfaces/repositories'

export interface GetUserUseCaseInterface {
  execute: (id?: string) => Promise<GetUserUseCaseInterface.Output>
}

export namespace GetUserUseCaseInterface {
  export type Output = UserOutput | UserOutput[]
}
