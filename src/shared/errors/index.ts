export class InvalidParamError extends Error {
  constructor (param: string) {
    super(`Invalid param: ${param}`)
    this.name = 'InvalidParamError'
  }
}

export class MissingParamError extends Error {
  constructor (param: string) {
    super(`Missing param: ${param}`)
    this.name = 'MissingParamError'
  }
}

export class ServerError extends Error {
  constructor (error?: Error) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = error?.stack
    this.message = error?.message ?? 'Unknow error'
  }
}

export class ForbiddenError extends Error {
  constructor (message?: string) {
    super(message ?? 'Forbidden')
    this.name = 'ForbiddenError'
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class JwtMissingError extends Error {
  constructor () {
    super('JWT token is missing')
    this.name = 'JwtMissingError'
  }
}
