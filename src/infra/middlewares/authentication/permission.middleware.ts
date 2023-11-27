import { PermissionRepository } from '@/infra/database/repositories'
import { ForbiddenError, InvalidParamError } from '@/shared/errors'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { NextFunction, Request, Response } from 'express'

export const permissionsMiddleware = (): any => {
  const permissionRepository = new PermissionRepository()

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissionCode = await permissionRepository.getByMethodAndRoute(req.method, req.url)
      if (!permissionCode) {
        throw new InvalidParamError('Unknow route')
      }

      const permissions = req.permissions
      if (!permissions || !permissions.includes(permissionCode)) {
        throw new ForbiddenError()
      }

      return next()
    } catch (err: any) {
      const error = handleError(err)
      res.status(error.statusCode).json({ error: error.body.message })
    }
  }
}
