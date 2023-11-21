export type UserOutput = {
  id: string
  name: string
  email: string
  permissions: number []
} | null

export type UserAllInfoOutput = {
  id: string
  name: string
  email: string
  password: string
  active: number
  permissions: number []
  createdAt: Date
  updatedAt?: Date
} | null

export type CreateUserRepositoryInput = {
  id: string
  name: string
  email: string
  password: string
  active: boolean
  permissions: string
  createdAt: Date
}

export type UpdateUserRepositoryInput = {
  id: string
  name?: string
  email?: string
  password?: string
  active?: boolean
  permissions?: string
  updatedAt: Date
}

export interface UserRepositoryInterface {
  getByEmail: (email: string) => Promise<UserOutput>
  getAllInfo: (email: string) => Promise<UserAllInfoOutput>
  create: (input: CreateUserRepositoryInput) => Promise<string>
  getById: (id: string) => Promise<UserOutput>
  update: (input: UpdateUserRepositoryInput) => Promise<void>
}
