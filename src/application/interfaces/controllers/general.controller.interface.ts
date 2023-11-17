import { HttpRequest, HttpResponse } from '@/shared/types'

export interface ControllerInterface {
  execute: (input: HttpRequest) => Promise<HttpResponse>
}
