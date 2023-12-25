import { HttpRequest } from '@/shared/types'
import { UpdateUserController } from './update-user.controller'
import { mock } from 'jest-mock-extended'
import { UpdateUserUseCaseInterface } from '@/application/usecases/users/update/update-user.types'
import { serverError, success } from '@/shared/helpers'

describe('UpdateUserController', () => {
  let sut: UpdateUserController
  let input: HttpRequest
  const updateUserUseCase = mock<UpdateUserUseCaseInterface>()

  beforeEach(() => {
    sut = new UpdateUserController(updateUserUseCase)
    input = {
      params: {
        id: 'anyId'
      },
      body: {
        name: 'AnyName',
        email: 'email@email.com',
        password: 'anyPassword',
        active: 0,
        permissions: [1, 3]
      }
    }
  })

  test('should call UpdateUserUseCase once and with all values', async () => {
    await sut.execute(input)

    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'AnyName',
      email: 'email@email.com',
      password: 'anyPassword',
      active: 0,
      permissions: [1, 3]
    })
  })

  test('should call UpdateUserUseCase once and without id', async () => {
    input.params.id = undefined

    await sut.execute(input)

    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: null,
      name: 'AnyName',
      email: 'email@email.com',
      password: 'anyPassword',
      active: 0,
      permissions: [1, 3]
    })
  })

  test('should call UpdateUserUseCase once and without name', async () => {
    input.body.name = undefined

    await sut.execute(input)

    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'anyId',
      name: null,
      email: 'email@email.com',
      password: 'anyPassword',
      active: 0,
      permissions: [1, 3]
    })
  })

  test('should call UpdateUserUseCase once and without email', async () => {
    input.body.email = undefined

    await sut.execute(input)

    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'AnyName',
      email: null,
      password: 'anyPassword',
      active: 0,
      permissions: [1, 3]
    })
  })

  test('should call UpdateUserUseCase once and without password', async () => {
    input.body.password = undefined

    await sut.execute(input)

    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'AnyName',
      email: 'email@email.com',
      password: null,
      active: 0,
      permissions: [1, 3]
    })
  })

  test('should call UpdateUserUseCase once and without active', async () => {
    input.body.active = undefined

    await sut.execute(input)

    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'AnyName',
      email: 'email@email.com',
      password: 'anyPassword',
      active: null,
      permissions: [1, 3]
    })
  })

  test('should call UpdateUserUseCase once and without permissions', async () => {
    input.body.permissions = undefined

    await sut.execute(input)

    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'anyId',
      name: 'AnyName',
      email: 'email@email.com',
      password: 'anyPassword',
      active: 0,
      permissions: null
    })
  })

  test('should call handleError if CreateUserUseCase throws an exception', async () => {
    const error = new Error('Error Test')
    updateUserUseCase.execute.mockImplementationOnce(() => { throw error })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(error))
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(success(204, null))
  })
})
