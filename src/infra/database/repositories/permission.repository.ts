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
}
