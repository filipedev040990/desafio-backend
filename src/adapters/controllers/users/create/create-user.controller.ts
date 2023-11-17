import { ControllerInterface } from '@/application/interfaces/controllers/general.controller.interface'
import { CreateUserUseCaseInterface } from '@/application/usecases/users/create/create-user.types'
import { success } from '@/shared/helpers'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class CreateUserController implements ControllerInterface {
  constructor (private readonly createUserUseCase: CreateUserUseCaseInterface) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const output = await this.createUserUseCase.execute(input.body)
      return success(201, output)
    } catch (error: any) {
      return handleError(error)
    }
  }
}
