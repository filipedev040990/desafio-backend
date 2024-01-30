/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PermissionRepository } from '@/infra/database/repositories/permission.repository'
import { UPDATE_ANOTHER_USER_PERMISSION } from '@/shared/constants'
import { ForbiddenError, InvalidParamError } from '@/shared/errors'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { NextFunction, Request, Response } from 'express'

export const routePermissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissionRepository = new PermissionRepository()

    const permissionCode = await permissionRepository.getPermissionCode(req.method, req.route.path)

    if (!permissionCode) {
      throw new InvalidParamError('Route not found')
    }

    const userPermissions = req.authenticatedUser.permissions
    if (!userPermissions?.includes(permissionCode) && !userPermissions?.includes(UPDATE_ANOTHER_USER_PERMISSION)) {
      throw new ForbiddenError()
    }

    return next()
  } catch (error) {
    const interpretedError = handleError(error)
    res.status(interpretedError.statusCode).json(interpretedError.body)
  }
}
