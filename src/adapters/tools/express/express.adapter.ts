import { ControllerInterface } from '@/application/interfaces/controllers/general.controller.interface'
import { RequestsRepository } from '@/infra/database/repositories'
import { HttpRequest } from '@/shared/types'
import { Request, Response } from 'express'
import { UUIDGenerator } from '../uuid/uuid.adapter'
import { obfuscateValue } from '@/shared/helpers/obfuscate-value.helper'

export const expressAdapter = (controller: ControllerInterface) => {
  return async (req: Request, res: Response) => {
    const requestRepository = new RequestsRepository()
    const uuidGenerator = new UUIDGenerator()

    const input: HttpRequest = {
      body: req.body,
      params: req.params
    }

    const requestId = await requestRepository.create({
      id: uuidGenerator.generate(),
      method: req.method,
      input: JSON.stringify(obfuscateValue({ ...input.body })),
      route: req.url,
      createdAt: new Date()
    })

    const { statusCode, body } = await controller.execute(input)
    const output = statusCode >= 500 ? { error: body.error } : body

    await requestRepository.update({
      requestId,
      status: statusCode,
      output: JSON.stringify(output),
      updatedAt: new Date()
    })

    res.status(statusCode).json(output)
  }
}
