import { CreateRequestRepositoryInput, RequestRepositoryInterface, UpdateRequestRepositotyInput } from '@/application/interfaces/repositories/request.repository.interface'
import { prismaClient } from '../config/prisma-client'

export class RequestsRepository implements RequestRepositoryInterface {
  async create (input: CreateRequestRepositoryInput): Promise<string> {
    const request = await prismaClient.request.create({ data: input })
    return request.id
  }

  async update (input: UpdateRequestRepositotyInput): Promise<void> {
    const data: Omit<UpdateRequestRepositotyInput, 'requestId'> = {
      status: input.status,
      output: input.output,
      updatedAt: input.updatedAt,
      userId: input.userId
    }

    await prismaClient.request.update({
      data,
      where: {
        id: input.requestId
      }
    })
  }
}
