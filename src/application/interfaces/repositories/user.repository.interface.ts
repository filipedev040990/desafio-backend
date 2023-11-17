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
  permissions: string
  createdAt: Date
}

export interface UserRepositoryInterface {
  getByEmail: (email: string) => Promise<UserOutput | null>
  create: (input: CreateUserRepositoryInput) => Promise<string>
}
