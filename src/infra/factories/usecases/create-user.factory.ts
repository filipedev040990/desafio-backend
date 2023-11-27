import { BcryptAdapter } from '@/adapters/tools/crypto/bcrypt.adapter'
import { UUIDGenerator } from '@/adapters/tools/uuid/uuid.adapter'
import { CreateUserUseCase } from '@/application/usecases/users/create/create-user.usecase'
import { PermissionRepository } from '@/infra/database/repositories'
import { UserRepository } from '@/infra/database/repositories/user.repository'

export const createUserUseCaseFactory = (): CreateUserUseCase => {
  const userRepository = new UserRepository()
  const uuidGenerator = new UUIDGenerator()
  const hashGenerator = new BcryptAdapter(12)
  const permissionRepository = new PermissionRepository()
  return new CreateUserUseCase(userRepository, uuidGenerator, hashGenerator, permissionRepository)
}
