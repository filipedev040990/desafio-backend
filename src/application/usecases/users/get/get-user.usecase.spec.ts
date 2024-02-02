import { mock } from 'jest-mock-extended'
import { GetUserUseCase } from './get-user.usecase'
import { UserRepositoryInterface } from '@/application/interfaces/repositories'

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
  let id: string

  beforeEach(() => {
    sut = new GetUserUseCase(userRepository)
    id = 'anyId'
    userRepository.getById.mockResolvedValue(singleUser)
    userRepository.getAll.mockResolvedValue(allUsers)
  })

  test('should call UserRepository.getById if a id is provided', async () => {
    await sut.execute(id)

    expect(userRepository.getById).toHaveBeenCalledTimes(1)
    expect(userRepository.getById).toHaveBeenCalledWith('anyId')
    expect(userRepository.getAll).toHaveBeenCalledTimes(0)
  })

  test('should call UserRepository.getAll if a id is not provided', async () => {
    await sut.execute()

    expect(userRepository.getAll).toHaveBeenCalledTimes(1)
    expect(userRepository.getById).toHaveBeenCalledTimes(0)
  })

  test('should return a single user when id is provided', async () => {
    const output = await sut.execute(id)

    expect(output).toEqual(singleUser)
  })

  test('should return all users when id is not provided', async () => {
    const output = await sut.execute()

    expect(output).toEqual(allUsers)
  })
})
