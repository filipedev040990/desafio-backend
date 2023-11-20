import { ControllerInterface } from '@/application/interfaces/controllers/general.controller.interface'
import { UpdateUserUseCaseInterface } from '@/application/usecases/users/update/update-user.types'
import { success } from '@/shared/helpers'
import { handleError } from '@/shared/helpers/handle-error.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class UpdateUserController implements ControllerInterface {
  constructor (private readonly updateUserUseCase: UpdateUserUseCaseInterface) {}
  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      await this.updateUserUseCase.execute({
        id: input.params.id ?? null,
        name: input.body.name ?? null,
        email: input.body.email ?? null,
        password: input.body.password ?? null,
        active: input.body.active ?? null,
        permissions: input.body.permissions ?? null
      })
      return success(204, null)
    } catch (error: any) {
      return handleError(error)
    }
  }
}
