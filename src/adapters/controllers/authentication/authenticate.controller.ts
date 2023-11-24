import { ControllerInterface } from '@/application/interfaces/controllers/general.controller.interface'
import { AuthenticateUseCaseInterface } from '@/application/usecases/authentication/authenticate.types'
import { success } from '@/shared/helpers'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class AuthenticateController implements ControllerInterface {
  constructor (private readonly authenticateUseCase: AuthenticateUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.authenticateUseCase.execute(input?.body)
      return success(200, output)
    } catch (error: any) {
      return handleError(error)
    }
  }
}
