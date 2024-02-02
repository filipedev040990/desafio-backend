import { GetUserController } from './get-user.controller'
import { GetUserUseCaseInterface } from '@/application/usecases/users/get/get-user.types'
import { serverError, success } from '@/shared/helpers'
import { mock } from 'jest-mock-extended'

const getUserUseCase = mock<GetUserUseCaseInterface>()
const user = {
  id: 'anyId',
  name: 'AnyName',
  email: 'anyEmail',
  permissions: [1, 2]
}

describe('GetUserController', () => {
  let sut: GetUserController
  let input: any

  beforeEach(() => {
    sut = new GetUserController(getUserUseCase)
    input = {
      query: {
        id: 'anyId'
      }
    }
    getUserUseCase.execute.mockResolvedValue(user)
  })

  test('should call GetUserUseCase.execute once and with correct id', async () => {
    await sut.execute(input)

    expect(getUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(getUserUseCase.execute).toHaveBeenCalledWith('anyId')
  })

  test('should call GetUserUseCase.execute once and without id', async () => {
    input.query = null

    await sut.execute(input)

    expect(getUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(getUserUseCase.execute).toHaveBeenCalledWith(null)
  })

  test('should return a correct output', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(success(200, user))
  })

  test('should call handleError if CreateUserUseCase throws an exception', async () => {
    const error = new Error('Error Test')
    getUserUseCase.execute.mockImplementationOnce(() => { throw error })

    const output = await sut.execute(input)

    expect(output).toEqual(serverError(error))
  })
})
