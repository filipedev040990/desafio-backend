import { ControllerInterface } from '@/application/interfaces/controllers/general.controller.interface'
import { GetUserUseCaseInterface } from '@/application/usecases/users/get/get-user.types'
import { success } from '@/shared/helpers'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class GetUserController implements ControllerInterface {
  constructor (private readonly getUserUseCase: GetUserUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.getUserUseCase.execute(input?.query?.id ?? null)
      return success(200, output)
    } catch (error: any) {
      return handleError(error)
    }
  }
}
