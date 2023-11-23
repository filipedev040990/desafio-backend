import { SaveUserTokenRepositoryInput, TokenRepositoryInterface, UpdateUserTokenRepositoryInput } from '@/application/interfaces/repositories/token.repository'
import { prismaClient } from '../config/prisma-client'

export class TokenRepository implements TokenRepositoryInterface {
  async save (input: SaveUserTokenRepositoryInput): Promise<void> {
    await prismaClient.token.create({
      data: {
        id: input.id,
        token: input.token,
        userId: input.userId,
        createdAt: input.createdAt
      }
    })
  }

  async update (input: UpdateUserTokenRepositoryInput): Promise<void> {
    await prismaClient.token.update({
      where: {
        userId: input.userId
      },
      data: {
        token: input.token,
        updatedAt: input.updatedAt
      }
    })
  }

  async getByUserId (userId: string): Promise<string | null> {
    const token = await prismaClient.token.findFirst({ where: { userId } })
    return token?.token ?? null
  }
}
