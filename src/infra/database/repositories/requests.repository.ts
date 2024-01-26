import { CreateRequestRepositoryInput, RequestRepositoryInterface } from '@/application/interfaces/repositories/request.repository.interface'
import { prismaClient } from '../config/prisma-client'

export class RequestsRepository implements RequestRepositoryInterface {
  async create (data: CreateRequestRepositoryInput): Promise<string> {
    const request = await prismaClient.request.create({ data })
    return request.id
  }
}
