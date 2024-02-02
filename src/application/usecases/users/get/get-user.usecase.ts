import { UserRepositoryInterface } from '@/application/interfaces/repositories'
import { GetUserUseCaseInterface } from './get-user.types'

export class GetUserUseCase implements GetUserUseCaseInterface {
  constructor (private readonly userRepository: UserRepositoryInterface) {}
  async execute (id?: string): Promise<GetUserUseCaseInterface.Output> {
    return await (id ? this.userRepository.getById(id) : this.userRepository.getAll())
  }
}
