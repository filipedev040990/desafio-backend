import { UpdateUserController } from '@/adapters/controllers/users/update/update-user.controller'
import { updateUserUseCaseFactory } from '../usecases/update-user.factory'

export const updateUserControllerFactory = (): UpdateUserController => {
  return new UpdateUserController(updateUserUseCaseFactory())
}
