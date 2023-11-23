import { BcryptAdapter } from '@/adapters/tools/crypto/bcrypt.adapter'
import { JwtAdapter } from '@/adapters/tools/token/jwt.adapter'
import { UUIDGenerator } from '@/adapters/tools/uuid/uuid.adapter'
import { AuthenticateUseCase } from '@/application/usecases/authentication/authenticate.usecase'
import { UserRepository } from '@/infra/database/repositories'
import { TokenRepository } from '@/infra/database/repositories/token.repository'

export const authenticateUseCaseFactory = (): AuthenticateUseCase => {
  const userRepository = new UserRepository()
  const hasher = new BcryptAdapter(12)
  const secretKey = process.env.SECRETKEY ?? ''
  const expiresIn = process.env.EXPIRESIN ?? ''
  const jwtToken = new JwtAdapter(secretKey, expiresIn)
  const tokenRepository = new TokenRepository()
  const uuidGenerator = new UUIDGenerator()

  return new AuthenticateUseCase(userRepository, hasher, jwtToken, tokenRepository, uuidGenerator)
}
