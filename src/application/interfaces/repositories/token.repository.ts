export interface TokenRepository {
  save: (input: SaveUserTokenRepositoryInput) => Promise<void>
  update: (input: SaveUserTokenRepositoryInput) => Promise<void>
}

export type SaveUserTokenRepositoryInput = {
  id: string
  userId: string
  token: string
  createdAt?: Date
  updatedAt?: Date
}
