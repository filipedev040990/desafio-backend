export interface TokenRepositoryInterface {
  save: (input: SaveUserTokenRepositoryInput) => Promise<void>
  update: (input: UpdateUserTokenRepositoryInput) => Promise<void>
  getByUserId: (userId: string) => Promise<string | null>
}

export type SaveUserTokenRepositoryInput = {
  id: string
  userId: string
  token: string
  createdAt: Date
}

export type UpdateUserTokenRepositoryInput = {
  userId: string
  token: string
  updatedAt: Date
}
