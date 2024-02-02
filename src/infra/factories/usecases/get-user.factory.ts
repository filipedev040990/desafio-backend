import { GetUserUseCase } from '@/application/usecases/users/get/get-user.usecase'
import { UserRepository } from '@/infra/database/repositories'

export const getUserUseCaseFactory = (): GetUserUseCase => {
  const userRepository = new UserRepository()
  return new GetUserUseCase(userRepository)
}
