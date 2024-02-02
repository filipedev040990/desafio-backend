export type HttpRequest = {
  body?: any
  params?: any
  headers?: any
  query?: any
  authenticatedUser: {
    id: string
    permissions: number []
  }
}

export type HttpResponse = {
  statusCode: number
  body: any
}
