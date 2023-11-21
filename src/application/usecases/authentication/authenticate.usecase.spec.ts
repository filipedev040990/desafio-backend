import { mock } from 'jest-mock-extended'
import { AuthenticateUseCase } from './authenticate.usecase'
import { UserRepositoryInterface } from '@/application/interfaces/repositories'
import { InvalidParamError, MissingParamError, UnauthorizedError } from '@/shared/errors'
import { HasherInterface, JwtInterface, UUIDGeneratorInterface } from '@/application/interfaces/tools'
import { TokenRepository } from '@/application/interfaces/repositories/token.repository'
import MockDate from 'mockdate'

describe('AuthenticateUseCase', () => {
  let sut: AuthenticateUseCase
  let input: any

  const userRepository = mock<UserRepositoryInterface>()
  const hasher = mock<HasherInterface>()
  const tokenGenerator = mock<JwtInterface>()
  const tokenRepository = mock<TokenRepository>()
  const uuidGenerator = mock<UUIDGeneratorInterface>()

  beforeEach(() => {
    sut = new AuthenticateUseCase(userRepository, hasher, tokenGenerator, tokenRepository, uuidGenerator)
    input = {
      email: 'email@email.com',
      password: 'anyPassword'
    }

    userRepository.getAllInfo.mockResolvedValue({
      id: 'anyUserId',
      name: 'anyUserName',
      email: input.email,
      active: 1,
      password: 'anyhash',
      permissions: [1, 2, 3],
      createdAt: new Date()
    })

    hasher.compare.mockResolvedValue(true)
    tokenGenerator.encrypt.mockResolvedValue('anyToken')
    uuidGenerator.generate.mockReturnValue('anyUUID')
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if email is not provided', async () => {
    input.email = undefined

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new MissingParamError('email'))
  })

  test('should throw if password is not provided', async () => {
    input.password = undefined

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new MissingParamError('password'))
  })

  test('should throw if a invalid email is provided', async () => {
    input.email = 'invalidEmail'

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('email'))
  })

  test('should call UserRepository.getAllInfo once and with correct email', async () => {
    await sut.execute(input)

    expect(userRepository.getAllInfo).toHaveBeenCalledTimes(1)
    expect(userRepository.getAllInfo).toHaveBeenCalledWith('email@email.com')
  })

  test('should call hasher.Compare once and with correct password', async () => {
    await sut.execute(input)

    expect(hasher.compare).toHaveBeenCalledTimes(1)
    expect(hasher.compare).toHaveBeenCalledWith('anyPassword', 'anyhash')
  })

  test('should call tokenGenerator once and with correct userId', async () => {
    await sut.execute(input)

    expect(tokenGenerator.encrypt).toHaveBeenCalledTimes(1)
    expect(tokenGenerator.encrypt).toHaveBeenCalledWith({ userId: 'anyUserId', permissions: [1, 2, 3] })
  })

  test('should return a token on success', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ token: 'anyToken' })
  })

  test('should throw if UserRepository.getByEmail returns null', async () => {
    userRepository.getAllInfo.mockResolvedValueOnce(null)

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new UnauthorizedError())
  })

  test('should throw if hasher.Compare returns false', async () => {
    hasher.compare.mockResolvedValueOnce(false)

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new UnauthorizedError())
  })

  test('should call Token.save once and with correct values', async () => {
    await sut.execute(input)

    expect(tokenRepository.save).toHaveBeenCalledTimes(1)
    expect(tokenRepository.save).toHaveBeenCalledWith({
      id: 'anyUUID',
      userId: 'anyUserId',
      token: 'anyToken',
      createdAt: new Date()
    })
  })
})
