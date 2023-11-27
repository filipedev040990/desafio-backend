import { AuthenticateUseCaseInterface } from '@/application/usecases/authentication/authenticate.types'
import { HttpRequest } from '@/shared/types'
import { AuthenticateController } from './authenticate.controller'
import { serverError, success } from '@/shared/helpers'
import { mock } from 'jest-mock-extended'

describe('AuthenticateController', () => {
  let sut: AuthenticateController
  let input: HttpRequest

  const authenticateUseCase = mock<AuthenticateUseCaseInterface>()

  beforeEach(() => {
    sut = new AuthenticateController(authenticateUseCase)
    input = {
      body: {
        email: 'anyEmail@email.com',
        password: 'anyPassword'
      }
    }

    authenticateUseCase.execute.mockResolvedValue({ token: 'anyToken', userId: 'anyUserId' })
  })

  test('should call AuthenticateUseCase once and with correct values', async () => {
    await sut.execute(input)

    expect(authenticateUseCase.execute).toHaveBeenCalledTimes(1)
    expect(authenticateUseCase.execute).toHaveBeenCalledWith(input.body)
  })

  test('should return 200 and correct output success', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(success(200, { token: 'anyToken', userId: 'anyUserId' }))
  })

  test('should return 500 if AuthenticateUseCase throws an exception', async () => {
    const error = new Error('Any Error')

    authenticateUseCase.execute.mockImplementationOnce(() => {
      throw error
    })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(error))
  })
})
