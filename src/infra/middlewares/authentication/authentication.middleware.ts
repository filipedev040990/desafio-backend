import { UserRepository } from '@/infra/database/repositories'
import { jwtTokenFactory } from '@/infra/factories/tools/jwt.factory'
import { UnauthorizedError, ForbiddenError } from '@/shared/errors'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { Request, Response, NextFunction } from 'express'

export const authenticationMiddleware = (): any => {
  const jwtToken = jwtTokenFactory()
  const userRepository = new UserRepository()

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req?.headers?.authorization) {
        throw new ForbiddenError()
      }

      const token = req.headers.authorization.split('Bearer ')[1]
      const data: any = await jwtToken.decrypt(token)

      if (!data) {
        throw new UnauthorizedError()
      }

      const user = await userRepository.getById(data.userId)

      if (!user) {
        throw new UnauthorizedError()
      }

      req.userId = user.id
      req.permissions = user.permissions
      return next()
    } catch (err: any) {
      const error = handleError(err)
      res.status(error.statusCode).json({ error: error.body.message })
    }
  }
}
