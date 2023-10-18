import MockDate from 'mockdate'
import { CreateEmployeeUseCase } from './create-employee.usecase'
import { ISchemaValidator } from '@/ports/validators/schema-validator.port'
import { IUUIDGenerator } from '@/ports/usecases/uuid/uuid-generator.port'
import { InvalidParamError } from '../../../shared/errors'
import { mock } from 'jest-mock-extended'
import { IEmployeeRepository } from '@/ports/repositories/employee.port'

const employeeRepository = mock<IEmployeeRepository>()
const schemaValidator = mock<ISchemaValidator>()
const uuidGenerator = mock<IUUIDGenerator>()

describe('CreateEmployeeUseCase', () => {
  let sut: CreateEmployeeUseCase
  let input: any

  beforeEach(() => {
    sut = new CreateEmployeeUseCase(employeeRepository, schemaValidator, uuidGenerator)
    input = {
      name: 'John Doe',
      email: 'john@email.com',
      cpf: '1234567890',
      password: 'password123'
    }
    uuidGenerator.generate.mockReturnValue('generatedUUID')
    schemaValidator.validate.mockReturnValue({ value: input })
    employeeRepository.findByCpf.mockResolvedValue(null)
    employeeRepository.findByEmail.mockResolvedValue(null)
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should create an employee with valid input', async () => {
    employeeRepository.create.mockResolvedValue('generatedUUID')

    const result = await sut.execute(input)

    expect(result).toEqual('generatedUUID')
  })

  test('should throw InvalidParamError for duplicate email', async () => {
    employeeRepository.findByEmail.mockResolvedValue({
      id: 'anyId',
      name: 'John Doe',
      email: 'john@email.com',
      cpf: '1234567890',
      password: 'password123',
      createdAt: new Date('2021-09-21T22:00:00.000Z'),
      updatedAt: new Date('2021-09-21T22:00:00.000Z'),
      deletedAt: new Date('9999-12-31T23:59:59.999Z')
    })
    await expect(sut.execute(input)).rejects.toThrow(InvalidParamError)
  })

  test('should throw InvalidParamError for duplicate cpf', async () => {
    employeeRepository.findByCpf.mockResolvedValue({
      id: 'anyId',
      name: 'John Doe',
      email: 'john@email.com',
      cpf: '1234567890',
      password: 'password123',
      createdAt: new Date('2021-09-21T22:00:00.000Z'),
      updatedAt: new Date('2021-09-21T22:00:00.000Z'),
      deletedAt: new Date('9999-12-31T23:59:59.999Z')
    })
    await expect(sut.execute(input)).rejects.toThrow(InvalidParamError)
  })
})
