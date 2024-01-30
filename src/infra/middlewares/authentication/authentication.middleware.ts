/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { JwtAdapter } from '@/adapters/tools/token/jwt.adapter'
import { UserOutput } from '@/application/interfaces/repositories'
import { UserRepository } from '@/infra/database/repositories'
import { TokenRepository } from '@/infra/database/repositories/token.repository'
import { ForbiddenError, JwtMissingError, UnauthorizedError } from '@/shared/errors'
import { isValidString } from '@/shared/helpers'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { NextFunction, Request, Response } from 'express'

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await getToken(req?.headers)
    const data = decryptToken(token)

    if (data) {
      const user = await getUser(data.userId)
      if (user) {
        req.userId = user.id
        req.permissions = user.permissions
        return next()
      }
    }

    throw new UnauthorizedError()
  } catch (error) {
    const interpretedError = handleError(error)
    res.status(interpretedError.statusCode).json(interpretedError.body)
  }
}

const getToken = async (headers: any): Promise<string> => {
  if (!isValidString(headers?.authorization)) {
    throw new JwtMissingError()
  }

  const tokenRepository = new TokenRepository()
  const token = headers.authorization.split('Bearer ')[1]
  const tokenExists = await tokenRepository.getByToken(token)

  if (!tokenExists) {
    throw new ForbiddenError('Invalid JWT token')
  }
  return token
}

const decryptToken = (token: string): any => {
  const jwtToken = new JwtAdapter(process.env.SECRET_KEY ?? '')
  const data = jwtToken.decrypt(token)
  return data ?? null
}

const getUser = async (userId: string): Promise<UserOutput> => {
  const userRepository = new UserRepository()
  const user = await userRepository.getById(userId)
  return user ?? null
}
