import { expressMiddlewareAdapter } from '@/adapters/tools/express/middleware.adapter'
import { JwtAdapter } from '@/adapters/tools/token/jwt.adapter'
import { UserRepository } from '@/infra/database/repositories'
import { AuthenticationMiddleware } from '@/infra/middlewares/authentication/authentication.middleware'

export const authenticationMiddleware = (): any => {
  const secretKey = process.env.SECRETKEY ?? ''
  const expiresIn = process.env.EXPIRESIN ?? ''
  const jwtToken = new JwtAdapter(secretKey, expiresIn)
  const userRepository = new UserRepository()
  return expressMiddlewareAdapter(new AuthenticationMiddleware(jwtToken, userRepository))
}
