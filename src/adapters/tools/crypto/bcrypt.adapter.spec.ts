import { BcryptAdapter } from './bcrypt.adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('any hash'),
  compare: jest.fn().mockReturnValue(true)
}))

describe('BcryptAdapter', () => {
  let sut: BcryptAdapter
  let salt: number
  beforeAll(() => {
    salt = 12
    sut = new BcryptAdapter(salt)
  })

  describe('hash', () => {
    test('should call bcrypt.hash once and with correct values', async () => {
      await sut.hash('any value')

      expect(bcrypt.hash).toHaveBeenCalledTimes(1)
      expect(bcrypt.hash).toHaveBeenCalledWith('any value', 12)
    })

    test('should return a hash', async () => {
      const hash = await sut.hash('any value')

      expect(hash).toBe('any hash')
    })
  })

  describe('compare', () => {
    test('should call bcrypt.compare once and with correct values', async () => {
      await sut.compare('any value', 'any hash')

      expect(bcrypt.compare).toHaveBeenCalledTimes(1)
      expect(bcrypt.compare).toHaveBeenCalledWith('any value', 'any hash')
    })

    test('should return true', async () => {
      const output = await sut.compare('any value', 'any hash')

      expect(output).toBeTruthy()
    })
  })
})
