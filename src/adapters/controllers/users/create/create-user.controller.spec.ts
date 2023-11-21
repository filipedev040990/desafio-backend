import { HttpRequest } from '@/shared/types'
import { CreateUserController } from './create-user.controller'
import { CreateUserUseCaseInterface } from '@/application/usecases/users/create/create-user.types'
import { mock } from 'jest-mock-extended'
import { serverError, success } from '@/shared/helpers'

describe('CreateUserController', () => {
  let sut: CreateUserController
  let input: HttpRequest
  const createUserUseCase = mock<CreateUserUseCaseInterface>()

  beforeAll(() => {
    sut = new CreateUserController(createUserUseCase)
    input = {
      body: {
        name: 'AnyName',
        email: 'any@email.com',
        password: 'anyPassword',
        passwordConfirmation: 'anyPassword',
        permissions: [1, 2, 3, 4]
      }
    }
    createUserUseCase.execute.mockResolvedValue({
      id: 'anyId'
    })
  })

  test('should call CreateUserUseCase once and with correct values', async () => {
    await sut.execute(input)

    expect(createUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(createUserUseCase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(success(201, {
      id: 'anyId'
    }))
  })

  test('should call handleError if CreateUserUseCase throws an exception', async () => {
    const error = new Error('Error Test')
    createUserUseCase.execute.mockImplementationOnce(() => { throw error })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(error))
  })
})
