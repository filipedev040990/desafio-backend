import { ForbiddenError, InvalidParamError, JwtMissingError, MissingParamError, UnauthorizedError } from '../errors'
import { HttpResponse } from '../types'
import { badRequest, forbiddenError, serverError, unauthorized } from './http.helper'

export const handleError = (error: any): HttpResponse => {
  if (error instanceof InvalidParamError || error instanceof MissingParamError) {
    return badRequest(error)
  }

  if (error instanceof UnauthorizedError) {
    return unauthorized()
  }

  if (error instanceof ForbiddenError || error instanceof JwtMissingError) {
    return forbiddenError(error)
  }

  return serverError(error)
}
