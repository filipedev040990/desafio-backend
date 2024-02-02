import { mock } from 'jest-mock-extended'
import { GetUserUseCase } from './get-user.usecase'
import { UserRepositoryInterface } from '@/application/interfaces/repositories'
import { InvalidParamError } from '@/shared/errors'

const userRepository = mock<UserRepositoryInterface>()
const singleUser = {
  id: 'anyId',
  name: 'AnyName',
  email: 'anyEmail',
  permissions: [1, 2]
}

const allUsers = [{
  id: 'anyId',
  name: 'AnyName',
  email: 'anyEmail',
  permissions: [1, 2]
}, {
  id: 'anotherId',
  name: 'AnotherName',
  email: 'anotherEmail',
  permissions: [2]
}]

describe('GetUserUseCase', () => {
  let sut: GetUserUseCase
  let input: any

  beforeEach(() => {
    sut = new GetUserUseCase(userRepository)
    input = {
      id: 'anyId',
      authenticatedUser: {
        id: 'anyId',
        permissions: [9999]
      }
    }
    userRepository.getById.mockResolvedValue(singleUser)
    userRepository.getAll.mockResolvedValue(allUsers)
  })

  test('should call UserRepository.getById if a id is provided', async () => {
    await sut.execute(input)

    expect(userRepository.getById).toHaveBeenCalledTimes(1)
    expect(userRepository.getById).toHaveBeenCalledWith('anyId')
    expect(userRepository.getAll).toHaveBeenCalledTimes(0)
  })

  test('should call UserRepository.getAll if a id is not provided', async () => {
    input.id = undefined

    await sut.execute(input)

    expect(userRepository.getAll).toHaveBeenCalledTimes(1)
    expect(userRepository.getById).toHaveBeenCalledTimes(0)
  })

  test('should return a single user when id is provided', async () => {
    const output = await sut.execute(input)

    expect(output).toEqual(singleUser)
  })

  test('should return all users when id is not provided', async () => {
    input.id = undefined

    const output = await sut.execute(input)

    expect(output).toEqual(allUsers)
  })

  test('should throw if another user list without permission', async () => {
    input.authenticatedUser = {
      id: 'anotherId',
      permissions: [1]
    }

    const output = sut.execute(input)

    await expect(output).rejects.toThrowError(new InvalidParamError('You do not have permission to list this user'))
  })
})
