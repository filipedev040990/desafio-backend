import { ReadEmployeeUseCase } from '@/domain/usecases/employee/read-employee.usecase'
import { IController } from '../../../ports/controllers/index.port'
import { HttpRequest, HttpResponse } from '@/shared/types/http.types'
import { success, handleError } from '@/shared'

export class ReadEmployeeController implements IController {
  constructor(private readonly readEmployeeUseCase: ReadEmployeeUseCase) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      const id = input.params.id
      const employee = await this.readEmployeeUseCase.findOne({ id })
      return success(200, { employee })
    } catch (error: any) {
      return handleError(error)
    }
  }
}
