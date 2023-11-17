import { ForbiddenError, InvalidParamError, MissingParamError, UnauthorizedError } from '../errors'
import { HttpResponse } from '../types'
import { badRequest, forbiddenError, serverError, unauthorized } from './http.helper'

export const handleError = (error: any): HttpResponse => {
  if (error instanceof InvalidParamError || error instanceof MissingParamError) {
    return badRequest(error)
  }

  if (error instanceof UnauthorizedError) {
    return unauthorized(error)
  }

  if (error instanceof ForbiddenError) {
    return forbiddenError(error)
  }

  return serverError(error)
}
