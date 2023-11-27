import { PermissionRepositoryInterface } from '@/application/interfaces/repositories/permission.repository.interface'
import { prismaClient } from '../config/prisma-client'

export class PermissionRepository implements PermissionRepositoryInterface {
  async getByMethodAndRoute (method: string, route: string): Promise<number | null> {
    const permission = await prismaClient.permissions.findFirst({
      where: {
        method,
        route
      }
    })

    return permission ? permission.permissionCode : null
  }

  async getPermissionsCode (): Promise<number[] | null> {
    const permissions = await prismaClient.permissions.findMany()
    if (!permissions) {
      return null
    }

    const permissionsCode: number [] = []

    for (const permission of permissions) {
      permissionsCode.push(permission.permissionCode)
    }

    return permissionsCode
  }
}
