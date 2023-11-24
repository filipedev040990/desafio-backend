import { HttpRequest } from '@/shared/types'
import { AuthenticationMiddleware } from './authentication.middleware'
import { ForbiddenError, UnauthorizedError } from '@/shared/errors'
import { mock } from 'jest-mock-extended'
import { JwtAdapter } from '@/adapters/tools/token/jwt.adapter'
import { UserRepositoryInterface } from '@/application/interfaces/repositories'

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let input: HttpRequest

  const jwtToken = mock<JwtAdapter>()
  const userRepository = mock<UserRepositoryInterface>()

  beforeEach(() => {
    sut = new AuthenticationMiddleware(jwtToken, userRepository)
    input = {
      headers: {
        authorization: 'Bearer AnyToken'
      }
    }

    jwtToken.decrypt.mockResolvedValue({ userId: 'anyUserId', permissions: [1, 2, 3] })

    userRepository.getById.mockResolvedValue({
      id: 'anyUserId',
      name: 'anyUserName',
      email: 'anyEmail@email.com',
      permissions: [1, 2, 3]
    })
  })

  test('should throw if header is not provided', async () => {
    input.headers = undefined

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new ForbiddenError())
  })

  test('should throw if token is not provided in header request', async () => {
    input.headers.authorization = undefined

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new ForbiddenError())
  })

  test('should call Token.decrypt once and with correct token', async () => {
    await sut.execute(input)

    expect(jwtToken.decrypt).toHaveBeenCalledTimes(1)
    expect(jwtToken.decrypt).toHaveBeenCalledWith('AnyToken')
  })

  test('should throw if token invalid is provided', async () => {
    jwtToken.decrypt.mockResolvedValueOnce(null)

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new UnauthorizedError())
  })

  test('should call UserRepository.getById once and with correct userId', async () => {
    await sut.execute(input)

    expect(userRepository.getById).toHaveBeenCalledTimes(1)
    expect(userRepository.getById).toHaveBeenCalledWith('anyUserId')
  })

  test('should throw if UserRepository.getById returns null', async () => {
    userRepository.getById.mockResolvedValueOnce(null)

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new UnauthorizedError())
  })

  test('should return a correct output on success', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({
      statusCode: 200,
      body: {
        userId: 'anyUserId',
        permissions: [1, 2, 3]
      }
    })
  })
})
