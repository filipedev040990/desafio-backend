export type UserOutput = {
  id: string
  name: string
  email: string
  permissions: number []
}

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
  getByEmail: (email: string) => Promise<UserOutput | null>
  create: (input: CreateUserRepositoryInput) => Promise<string>
  getById: (id: string) => Promise<UserOutput | null>
  update: (input: UpdateUserRepositoryInput) => Promise<void>
}
