import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateUserUseCase } from './update-user.usecase'
import { mock } from 'jest-mock-extended'
import { PermissionRepositoryInterface, UserRepositoryInterface } from '@/application/interfaces/repositories'
import { HasherInterface } from '@/application/interfaces/tools'
import MockDate from 'mockdate'

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
    permissionRepository.getAllPermissionsCode.mockResolvedValue([1, 2, 3, 4])
    input = {
      id: 'anyId',
      email: 'email@email.com',
      name: 'AnyName',
      password: '123',
      active: 1,
      permissions: [1, 2, 3],
      authenticatedUser: {
        id: 'anyId',
        permissions: [9999]
      }
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

  test('should call UserRepository.update once and with correct values', async () => {
    await sut.execute(input)

    expect(userRepository.update).toHaveBeenCalledTimes(1)
    expect(userRepository.update).toHaveBeenCalledWith({
      id: 'anyId',
      updatedAt: new Date(),
      email: 'email@email.com',
      password: 'anyHash',
      active: 1,
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

  test('should throw if another user updates without permission', async () => {
    input.authenticatedUser = {
      id: 'anotherId',
      permissions: [1]
    }

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('You do not have permission to update this user'))
  })

  test('should update another user with special permission', async () => {
    input.authenticatedUser = {
      id: 'anotherId',
      permissions: [9999]
    }

    await sut.execute(input)

    expect(userRepository.update).toHaveBeenCalledTimes(1)
    expect(userRepository.update).toHaveBeenCalledWith({
      id: 'anyId',
      updatedAt: new Date(),
      email: 'email@email.com',
      password: 'anyHash',
      active: 1,
      name: 'AnyName',
      permissions: '1,2,3'
    })
  })

  test('should throws if a invalid permission is provided', async () => {
    input.permissions = [1, 2, 5, 6, 7]

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('permission 5,6,7'))
  })
})
