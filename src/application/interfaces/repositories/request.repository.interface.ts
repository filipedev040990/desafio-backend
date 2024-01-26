export interface RequestRepositoryInterface {
  create: (input: CreateRequestRepositoryInput) => Promise<string>
}

export type CreateRequestRepositoryInput = {
  id: string
  userId?: string
  method: string
  route: string
  input: string
  status: number
  output: string
  createdAt: Date
}
