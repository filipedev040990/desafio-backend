import { AuthenticateController } from '@/adapters/controllers/authentication/authenticate.controller'
import { authenticateUseCaseFactory } from '../usecases/authenticate.factory'

export const authenticateControllerFactory = (): AuthenticateController => {
  return new AuthenticateController(authenticateUseCaseFactory())
}
