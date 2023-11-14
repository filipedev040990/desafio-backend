import { CreateUserRepositoryInput, UserOutput, UserRepositoryInterface } from '@/application/repositories'
import { prismaClient } from '../config/prisma-client'

export class UserRepository implements UserRepositoryInterface {
  async getByEmail (email: string): Promise<UserOutput | null> {
    const user = await prismaClient.user.findUnique({ where: { email } })

    if (!user) {
      return null
    }
    const permissions: number [] = []
    user.permissions.split(',').map((permission: string) => permissions.push(+permission))

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      permissions
    }
  }

  async create (input: CreateUserRepositoryInput): Promise<string> {
    const user = await prismaClient.user.create({
      data: {
        id: input.id,
        name: input.name,
        email: input.email,
        password: input.password,
        permissions: input.permissions,
        createdAt: input.createdAt
      }
    })

    return user.id
  }
}
