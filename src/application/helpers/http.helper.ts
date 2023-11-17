import { ForbiddenError, UnauthorizedError } from '@/application/errors'
import { HttpResponse } from '@/application/types'

export const success = (statusCode: number, body: any): HttpResponse => ({
  statusCode,
  body
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbiddenError = (): HttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error
})
