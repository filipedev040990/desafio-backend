import { JwtMissingError, ServerError, UnauthorizedError } from '../errors'
import { HttpResponse } from '../types'

export const success = (statusCode: number, body: any): HttpResponse => ({
  statusCode,
  body
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    error: error.name,
    message: error.message
  }
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError().message
})

export const forbiddenError = (): HttpResponse => ({
  statusCode: 403,
  body: new JwtMissingError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error instanceof Error ? error : undefined)
})
