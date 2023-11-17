
import { UUIDGeneratorInterface } from '@/application/interfaces/tools'
import crypto from 'crypto'

export class UUIDGenerator implements UUIDGeneratorInterface {
  generate (): string {
    return crypto.randomUUID()
  }
}
