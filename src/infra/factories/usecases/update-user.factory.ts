import { BcryptAdapter } from '@/adapters/tools/crypto/bcrypt.adapter'
import { UpdateUserUseCase } from '@/application/usecases/users/update/update-user.usecase'
import { UserRepository } from '@/infra/database/repositories'

export const updateUserUseCaseFactory = (): UpdateUserUseCase => {
  const userRepository = new UserRepository()
  const hashGenerator = new BcryptAdapter(12)
  return new UpdateUserUseCase(userRepository, hashGenerator)
}
