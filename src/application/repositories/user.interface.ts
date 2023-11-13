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
  permissions: number []
}

export interface UserRepository {
  getByEmail: (email: string) => Promise<UserOutput | null>
  create: (input: CreateUserRepositoryInput) => Promise<string>
}
