
import { UserRepositoryInterface, UserOutput, CreateUserRepositoryInput, UpdateUserRepositoryInput } from '@/application/interfaces/repositories'
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
        active: input.active,
        password: input.password,
        permissions: input.permissions,
        createdAt: input.createdAt
      }
    })

    return user.id
  }

  async getById (id: string): Promise<UserOutput | null> {
    const user = await prismaClient.user.findFirst({ where: { id } })
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

  async update (input: UpdateUserRepositoryInput): Promise<void> {
    const { id, updatedAt, ...inputWithoutId } = input
    await prismaClient.user.update({
      where: { id },
      data: { ...inputWithoutId, updatedAt }
    })
  }
}
