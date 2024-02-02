import { GetUserController } from '@/adapters/controllers/users/get/get-user.controller'
import { getUserUseCaseFactory } from '../usecases/get-user.factory'

export const getUserControllerFactory = (): GetUserController => {
  return new GetUserController(getUserUseCaseFactory())
}
