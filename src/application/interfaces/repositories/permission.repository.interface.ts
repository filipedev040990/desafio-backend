export interface PermissionRepositoryInterface {
  getByMethodAndRoute: (method: string, route: string) => Promise<number | null>
}
