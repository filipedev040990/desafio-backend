import { HttpRequest, HttpResponse } from '@/shared/types'

export interface AuthenticationMiddlewareInterface {
  execute: (input: HttpRequest) => Promise<HttpResponse>
}
