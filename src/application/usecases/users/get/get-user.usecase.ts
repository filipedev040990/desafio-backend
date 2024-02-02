import { UserRepositoryInterface } from '@/application/interfaces/repositories'
import { GetUserUseCaseInterface } from './get-user.types'
import { UPDATE_ANOTHER_USER_PERMISSION } from '@/shared/constants'
import { InvalidParamError } from '@/shared/errors'

export class GetUserUseCase implements GetUserUseCaseInterface {
  constructor (private readonly userRepository: UserRepositoryInterface) {}
  async execute (input: GetUserUseCaseInterface.Input): Promise<GetUserUseCaseInterface.Output> {
    const canListAllUsers = this.canListAllUsers(input)

    if (input.id) {
      const isUserRequestedBySelf = input.authenticatedUser.id === input.id
      const canListUser = isUserRequestedBySelf || (!isUserRequestedBySelf && canListAllUsers)

      if (canListUser) {
        return this.userRepository.getById(input.id)
      } else {
        throw new InvalidParamError('You do not have permission to list this user')
      }
    } else {
      if (canListAllUsers) {
        return this.userRepository.getAll()
      } else {
        throw new InvalidParamError('You do not have permission to list all users')
      }
    }
  }

  canListAllUsers (input: GetUserUseCaseInterface.Input): boolean {
    return input.authenticatedUser.permissions.includes(UPDATE_ANOTHER_USER_PERMISSION)
  }
}
