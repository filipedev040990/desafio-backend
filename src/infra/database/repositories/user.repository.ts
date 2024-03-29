
import { UserRepositoryInterface, UserOutput, CreateUserRepositoryInput, UpdateUserRepositoryInput, UserAllInfoOutput } from '@/application/interfaces/repositories'
import { prismaClient } from '../config/prisma-client'

export class UserRepository implements UserRepositoryInterface {
  async getByEmail (email: string): Promise<UserOutput | null> {
    const user = await prismaClient.user.findUnique({ where: { email } })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      permissions: this.transformStringPermissionsIntoArray(user.permissions)
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      permissions: this.transformStringPermissionsIntoArray(user.permissions)
    }
  }

  async update (input: UpdateUserRepositoryInput): Promise<void> {
    const { id, updatedAt, ...inputWithoutId } = input
    await prismaClient.user.update({
      where: { id },
      data: { ...inputWithoutId, updatedAt }
    })
  }

  async getAllInfo (email: string): Promise<UserAllInfoOutput> {
    const user = await prismaClient.user.findFirst({ where: { email } })
    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active ? 1 : 0,
      permissions: this.transformStringPermissionsIntoArray(user.permissions),
      password: user.password,
      createdAt: user.createdAt
    }
  }

  async getAll (): Promise<UserOutput[] | null> {
    const users = await prismaClient.user.findMany()

    if (!users) {
      return null
    }

    const output: UserOutput[] = []

    for (const user of users) {
      output.push({
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: this.transformStringPermissionsIntoArray(user.permissions)
      })
    }

    return output
  }

  private transformStringPermissionsIntoArray (permissions: string): number [] {
    const permissionsArray: number [] = []
    permissions.split(',').map((permission: string) => permissionsArray.push(+permission))
    return permissionsArray
  }
}
