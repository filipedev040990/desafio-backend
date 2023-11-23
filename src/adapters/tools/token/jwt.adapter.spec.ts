import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt.adapter'

jest.mock('jsonwebtoken', () => ({
  sign: async () => {
    return await Promise.resolve('anyToken')
  },
  verify: async () => {
    return await Promise.resolve('anyTokenDecrypted')
  }
}))

type SutType = {
  sut: JwtAdapter
}

const secretKey = process.env.SECRETKEY!
const expiresIn = process.env.EXPIRESIN
const makeSut = (): SutType => {
  const sut = new JwtAdapter(secretKey, expiresIn)
  return { sut }
}

describe('JwtAdapter', () => {
  describe('encrypt', () => {
    test('should call JwtAdapter with correct values and expiresIn in constructor', async () => {
      const { sut } = makeSut()
      const spy = jest.spyOn(jwt, 'sign')
      await sut.encrypt({ account_id: 'anyId' })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith({ account_id: 'anyId' }, secretKey, { expiresIn })
    })

    test('should call JwtAdapter with correct values and without expiresIn in constructor', async () => {
      const sut = new JwtAdapter(secretKey)
      const spy = jest.spyOn(jwt, 'sign')
      await sut.encrypt({ account_id: 'anyId' })
      expect(spy).toHaveBeenCalledWith({ account_id: 'anyId' }, secretKey, { expiresIn })
    })

    test('should throw if JwtAdapter throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const response = sut.encrypt({ account_id: 'anyId' })
      await expect(response).rejects.toThrow()
    })

    test('should return an token on success', async () => {
      const { sut } = makeSut()
      const token = await sut.encrypt({ account_id: 'anyId' })
      expect(token).toBe('anyToken')
    })
  })

  describe('verify', () => {
    test('should call JwtAdapter with correct values and expiresIn in constructor', async () => {
      const { sut } = makeSut()
      const spy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('anyToken')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('anyToken', secretKey)
    })

    test('should call JwtAdapter with correct values and without expiresIn in constructor', async () => {
      const sut = new JwtAdapter(secretKey)
      const spy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('anyToken')
      expect(spy).toHaveBeenCalledWith('anyToken', secretKey)
    })

    test('should return null if JwtAdapter throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      const response = await sut.decrypt('anyToken')
      expect(response).toBe(null)
    })

    test('should return an token decrypted on success', async () => {
      const { sut } = makeSut()
      const token = await sut.decrypt('anyToken')
      expect(token).toBe('anyTokenDecrypted')
    })
  })
})
