import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateUserUseCase } from './update-user.usecase'
import { mock } from 'jest-mock-extended'
import { UserRepositoryInterface } from '@/application/interfaces/repositories'
import { HasherInterface } from '@/application/interfaces/tools'
import MockDate from 'mockdate'
import { PermissionRepositoryInterface } from '@/application/interfaces/repositories/permission.repository.interface'

describe('UpdateUserUseCase', () => {
  let sut: UpdateUserUseCase
  let input: any

  const userRepository = mock<UserRepositoryInterface>()
  const hashGenerator = mock<HasherInterface>()
  const permissionRepository = mock<PermissionRepositoryInterface>()

  beforeEach(() => {
    sut = new UpdateUserUseCase(userRepository, hashGenerator, permissionRepository)

    userRepository.getById.mockResolvedValue({
      id: 'anyUserId',
      name: 'anyUserName',
      email: 'anyEmail@email.com',
      permissions: [1, 2, 3]
    })
    hashGenerator.hash.mockResolvedValue('anyHash')
    permissionRepository.getPermissionsCode.mockResolvedValue([1, 2, 3, 4])
    input = {
      id: 'anyId',
      email: 'email@email.com',
      name: 'AnyName',
      password: '123',
      active: true,
      permissions: [1, 2, 3]
    }
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should throw if id is not provided', async () => {
    input.id = undefined

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new MissingParamError('id'))
  })

  test('should call UserRepository.getById once and with correct id', async () => {
    await sut.execute(input)

    expect(userRepository.getById).toHaveBeenCalledTimes(1)
    expect(userRepository.getById).toHaveBeenCalledWith('anyId')
  })

  test('should throw if user does not exists', async () => {
    userRepository.getById.mockResolvedValueOnce(null)

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('User not found'))
  })

  test('should throws if an invalid email is provided', async () => {
    input.email = 'invalidEmail'

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('email'))
  })

  test('should throws if email already in use', async () => {
    userRepository.getByEmail.mockResolvedValueOnce({
      id: 'anotherId',
      name: 'anyUserName',
      email: 'email@email.com',
      permissions: [1, 2, 3]
    })

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('This email is already in use'))
  })

  test('should throws if name is provided and is empty', async () => {
    input.name = ' '

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('name'))
  })

  test('should call hashGenerator once and with correct password', async () => {
    await sut.execute(input)
    expect(hashGenerator.hash).toHaveBeenCalledTimes(1)
    expect(hashGenerator.hash).toHaveBeenCalledWith(input.password)
  })

  test('should throw if active status invalid is provided', async () => {
    input.active = 'any'

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('This status should be a boolean'))
  })

  test('should call PermissionRepository.getPermissionsCode once', async () => {
    await sut.execute(input)

    expect(permissionRepository.getPermissionsCode).toHaveBeenCalledTimes(1)
  })

  test('should throw if a invalid permission is provided', async () => {
    permissionRepository.getPermissionsCode.mockResolvedValueOnce([1, 2])
    input.permissions = [3, 4]

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('permissions'))
  })

  test('should throw if permissions is provided and isinvalid', async () => {
    input.permissions = ['1', '2']

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('permissions'))
  })

  test('should call UserRepository.update once and with correct values', async () => {
    await sut.execute(input)

    expect(userRepository.update).toHaveBeenCalledTimes(1)
    expect(userRepository.update).toHaveBeenCalledWith({
      id: 'anyId',
      updatedAt: new Date(),
      email: 'email@email.com',
      password: 'anyHash',
      active: true,
      name: 'AnyName',
      permissions: '1,2,3'
    })
  })

  test('should throw if Payload is empty', async () => {
    input = {
      id: 'anyId'
    }
    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new MissingParamError('Payload is empty'))
  })
})
