
import { UUIDGeneratorInterface } from '@/application/adapters/uuid.interface'
import crypto from 'crypto'

export class UUIDGenerator implements UUIDGeneratorInterface {
  generate (): string {
    return crypto.randomUUID()
  }
}
