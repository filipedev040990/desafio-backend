import { PermissionRepositoryInterface } from '@/application/interfaces/repositories'
import { prismaClient } from '../config/prisma-client'

export class PermissionRepository implements PermissionRepositoryInterface {
  async getPermissionCode (method: string, route: string): Promise<number | null> {
    const permission = await prismaClient.permission.findFirst({
      where: {
        method, route
      }
    })

    if (!permission) {
      return null
    }

    return permission.permissionCode
  }

  async getAllPermissionsCode (): Promise<number[]> {
    const permissionsCode: number [] = []
    const permissions = await prismaClient.permission.findMany()

    for (const permission of permissions) {
      permissionsCode.push(permission.permissionCode)
    }

    return permissionsCode
  }
}
