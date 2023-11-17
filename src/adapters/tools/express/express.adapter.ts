import { ControllerInterface } from '@/application/interfaces/controllers/general.controller.interface'
import { HttpRequest } from '@/shared/types'
import { Request, Response } from 'express'

export const expressAdapter = (controller: ControllerInterface) => {
  return async (req: Request, res: Response) => {
    const input: HttpRequest = {
      body: req.body
    }

    const { statusCode, body } = await controller.execute(input)
    const output = statusCode >= 500 ? { error: body.error } : body

    res.status(statusCode).json(output)
  }
}
