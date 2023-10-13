import { UpdateEmployeeUseCase } from './../../../domain/usecases/employee/update-employee.usecase'
import { HttpRequest, HttpResponse } from '@/shared/types/http.types'
import { IController } from '../../../ports/controllers/index.port'
import { serverError, success } from '../../../shared/helpers/http.helper'

export class UpdateEmployeeController implements IController {
  constructor(private readonly updateEmployeeUseCase: UpdateEmployeeUseCase) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, cpf, password } = input.body
      const { id } = input.params
      const idEmployee = await this.updateEmployeeUseCase.execute({
        id,
        name,
        email,
        cpf,
        password
      })
      return success(201, { idEmployee })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
