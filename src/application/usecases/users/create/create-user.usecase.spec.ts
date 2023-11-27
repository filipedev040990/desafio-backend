import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { CreateUserUseCase } from './create-user.usecase'
import { mock } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { UserRepositoryInterface } from '@/application/interfaces/repositories'
import { HasherInterface, UUIDGeneratorInterface } from '@/application/interfaces/tools'
import { PermissionRepositoryInterface } from '@/application/interfaces/repositories/permission.repository.interface'

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase
  let input: any
  const userRepository = mock<UserRepositoryInterface>()
  const uuidGenerator = mock<UUIDGeneratorInterface>()
  const hashGenerator = mock<HasherInterface>()
  const permissionRepository = mock<PermissionRepositoryInterface>()

  beforeAll(() => {
    sut = new CreateUserUseCase(userRepository, uuidGenerator, hashGenerator, permissionRepository)
    MockDate.set(new Date())
  })
  beforeEach(() => {
    input = {
      name: 'AnyName',
      email: 'any@email.com',
      password: 'anyPassword',
      passwordConfirmation: 'anyPassword',
      permissions: [1, 2, 3, 4]
    }

    userRepository.getByEmail.mockResolvedValue(null)
    userRepository.create.mockResolvedValue('anyUUID')
    uuidGenerator.generate.mockReturnValue('anyUUID')
    hashGenerator.hash.mockResolvedValue('anyHash')
    permissionRepository.getPermissionsCode.mockResolvedValue([1, 2, 3, 4])
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should throws if any required field is not provided', async () => {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation', 'permissions']

    for (const field of requiredFields) {
      input[field] = null

      const output = sut.execute(input)

      await expect(output).rejects.toThrowError(new MissingParamError(field))

      input[field] = field
    }
  })

  test('should throw if passwordConfirmation fails', async () => {
    input.password = 'anyPassword'
    input.passwordConfirmation = 'anotherPassword'

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('passwordConfirmation'))
  })

  test('should throws if an invalid email is provided', async () => {
    input.email = 'invalidEmail'

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('email'))
  })

  test('should throws if email already in use', async () => {
    userRepository.getByEmail.mockResolvedValueOnce({
      id: 'anyUserId',
      name: 'anyUserName',
      email: input.email,
      permissions: [1, 2, 3]
    })

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('This email is already in use'))
  })

  test('should call PermissionRepository.getPermissionsCode once', async () => {
    await sut.execute(input)

    expect(permissionRepository.getPermissionsCode).toHaveBeenCalledTimes(1)
  })

  test('should throw if a invalid permission is provided', async () => {
    permissionRepository.getPermissionsCode.mockResolvedValueOnce([1, 2])
    input.permissions = [3, 4]

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('Invalid permission is provided'))
  })

  test('should call UUIDGenerator once', async () => {
    await sut.execute(input)
    expect(uuidGenerator.generate).toHaveBeenCalledTimes(1)
  })

  test('should call hashGenerator once and with correct password', async () => {
    await sut.execute(input)
    expect(hashGenerator.hash).toHaveBeenCalledTimes(1)
    expect(hashGenerator.hash).toHaveBeenCalledWith(input.password)
  })

  test('should call UserRepository.create once and with correct values', async () => {
    await sut.execute(input)

    expect(userRepository.create).toHaveBeenCalledTimes(1)
    expect(userRepository.create).toHaveBeenCalledWith({
      id: 'anyUUID',
      name: 'AnyName',
      email: 'any@email.com',
      password: 'anyHash',
      active: true,
      permissions: '1,2,3,4',
      createdAt: new Date()
    })
  })

  test('should return a id on success', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual({ id: 'anyUUID' })
  })
})
