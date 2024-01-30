export interface PermissionRepositoryInterface {
  getPermissionCode: (method: string, route: string) => Promise<number | null>
  getAllPermissionsCode: () => Promise<number[]>
}
