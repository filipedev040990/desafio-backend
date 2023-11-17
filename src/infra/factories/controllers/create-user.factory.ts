import { CreateUserController } from '@/adapters/controllers/users/create/create-user.controller'
import { createUserUseCaseFactory } from '../usecases/create-user.factory'

export const createUserControllerFactory = (): CreateUserController => {
  return new CreateUserController(createUserUseCaseFactory())
}
