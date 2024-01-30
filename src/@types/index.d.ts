declare namespace Express {
  export interface Request {
    authenticatedUser: {
      id: string
      permissions: number []
    }
  }
}
