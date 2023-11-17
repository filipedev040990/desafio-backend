import { JwtInterface } from '@/application/interfaces/tools'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements JwtInterface {
  constructor (
    private readonly secretKey: string,
    private readonly expiresIn?: string
  ) {}

  async encrypt (payload: object): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn ?? process.env.EXPIRESIN })
  }

  async decrypt (token: string): Promise<string | object | null> {
    try {
      return jwt.verify(token, this.secretKey)
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
