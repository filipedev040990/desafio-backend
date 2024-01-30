import { ControllerInterface } from '@/application/interfaces/controllers/general.controller.interface'
import { RequestsRepository } from '@/infra/database/repositories'
import { HttpRequest } from '@/shared/types'
import { Request, Response } from 'express'
import { UUIDGenerator } from '../uuid/uuid.adapter'
import { obfuscateValue } from '@/shared/helpers/obfuscate-value.helper'

export const expressAdapter = (controller: ControllerInterface) => {
  return async (req: Request, res: Response) => {
    const input: HttpRequest = {
      body: req.body,
      params: req.params,
      authenticatedUser: {
        id: req.userId ?? '',
        permissions: req.permissions ?? []
      }
    }

    const { statusCode, body } = await controller.execute(input)
    const output = statusCode >= 500 ? { error: body.error } : body

    await addRequestLog(req, input, output, statusCode)

    res.status(statusCode).json(output)
  }
}

const addRequestLog = async (req: Request, input: HttpRequest, output: any, statusCode: number): Promise<void> => {
  const requestRepository = new RequestsRepository()
  const uuidGenerator = new UUIDGenerator()

  await requestRepository.create({
    id: uuidGenerator.generate(),
    userId: req?.userId ?? undefined,
    method: req.method,
    input: JSON.stringify(obfuscateValue({ ...input.body })),
    route: req.url,
    status: statusCode,
    output: JSON.stringify(output),
    createdAt: new Date()
  })
}
