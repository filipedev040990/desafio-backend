
import { UUIDGeneratorInterface } from '@/application/adapters/uuid.interface'
import crypto from 'crypto'
import { UUIDGenerator } from './uuid.adapter'

jest.mock('crypto', () => ({ randomUUID: jest.fn().mockReturnValue('anyUUID') }))

describe('UuidGenerator', () => {
  const sut: UUIDGeneratorInterface = new UUIDGenerator()

  test('should call ramdomUUID once', () => {
    sut.generate()
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1)
  })

  test('should return an uuid', () => {
    const uuid = sut.generate()

    expect(uuid).toBe('anyUUID')
  })
})
