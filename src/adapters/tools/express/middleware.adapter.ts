import { AuthenticationMiddlewareInterface } from '@/infra/middlewares/authentication/authentication.types'
import { HttpRequest } from '@/shared/types'
import { NextFunction, Request, Response } from 'express'

export const expressMiddlewareAdapter = (middleware: AuthenticationMiddlewareInterface) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input: HttpRequest = {
      headers: req.headers
    }

    const { statusCode, body } = await middleware.execute(input)

    if (statusCode >= 200 && statusCode <= 399) {
      if (body.userId) {
        req.userId = body.userId
      }

      if (body.permissions) {
        req.permissions = body.permissions
      }

      return next()
    }
    res.status(statusCode).json({ error: body.message })
  }
}
