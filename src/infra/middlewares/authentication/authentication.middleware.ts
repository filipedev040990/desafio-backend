import { HttpRequest, HttpResponse } from '@/shared/types'
import { AuthenticationMiddlewareInterface } from './authentication.types'
import { success } from '@/shared/helpers'
import { ForbiddenError, UnauthorizedError } from '@/shared/errors'
import { JwtAdapter } from '@/adapters/tools/token/jwt.adapter'
import { UserRepositoryInterface } from '@/application/interfaces/repositories'

export class AuthenticationMiddleware implements AuthenticationMiddlewareInterface {
  constructor (
    private readonly jwtToken: JwtAdapter,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    if (input?.headers?.authorization) {
      const token = input.headers.authorization.split('Bearer ')[1]
      const data: any = await this.jwtToken.decrypt(token)

      if (data) {
        const user = await this.userRepository.getById(data.userId)
        if (user) {
          return success(200, { userId: user.id, permissions: user.permissions })
        }
      }
      throw new UnauthorizedError()
    }

    throw new ForbiddenError()
  }
}
