import { BcryptAdapter } from '@/adapters/tools/crypto/bcrypt.adapter'
import { JwtAdapter } from '@/adapters/tools/token/jwt.adapter'
import { UUIDGenerator } from '@/adapters/tools/uuid/uuid.adapter'
import { CreateUserUseCase } from '@/application/usecases/users/create/create-user.usecase'
import { UserRepository } from '@/infra/database/repositories/user.repository'

export const createUserUseCaseFactory = (): CreateUserUseCase => {
  const userRepository = new UserRepository()
  const uuidGenerator = new UUIDGenerator()
  const hashGenerator = new BcryptAdapter(12)
  const secretKey = process.env.SECRETKEY ?? ''
  const expiresIn = process.env.EXPIRESIN ?? ''
  const tokenGenerator = new JwtAdapter(secretKey, expiresIn)
  return new CreateUserUseCase(userRepository, uuidGenerator, hashGenerator, tokenGenerator)
}
