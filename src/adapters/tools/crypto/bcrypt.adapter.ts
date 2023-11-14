import { HasherInterface } from '@/application/adapters'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HasherInterface {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
