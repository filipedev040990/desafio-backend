export interface RequestRepositoryInterface {
  create: (input: CreateRequestRepositoryInput) => Promise<string>
  update: (input: UpdateRequestRepositotyInput) => Promise<void>
}

export type CreateRequestRepositoryInput = {
  id: string
  userId?: string
  method: string
  route: string
  input: string
  createdAt: Date
}

export type UpdateRequestRepositotyInput = {
  requestId: string
  userId?: string
  status: number
  output: string
  updatedAt: Date
}
