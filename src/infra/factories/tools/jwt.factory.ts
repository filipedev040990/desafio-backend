import { JwtAdapter } from '@/adapters/tools/token/jwt.adapter'

export const jwtTokenFactory = (): JwtAdapter => {
  const secretKey = process.env.SECRETKEY ?? ''
  const expiresIn = process.env.EXPIRESIN ?? ''
  return new JwtAdapter(secretKey, expiresIn)
}
