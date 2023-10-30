import { IEmployeeRepository } from '@/ports/repositories/employee.port'
import { CreateEmployeeController } from './create-employee.controller'
import { ISchemaValidator } from '@/ports/validators/schema-validator.port'
import { IUUIDGenerator } from '@/ports/usecases/uuid/uuid-generator.port'
import { mock } from 'jest-mock-extended'
import { CreateEmployeeUseCase } from '@/domain/usecases/employee/create-employee.usecase'
import MockDate from 'mockdate'
import { ServerError } from '@/shared/errors'
import { IEncrypt } from '@/ports/usecases/encrypt/encrypt.port'

const employeeRepository = mock<IEmployeeRepository>()
const schemaValidator = mock<ISchemaValidator>()
const uuidGenerator = mock<IUUIDGenerator>()
const encryptoPassword = mock<IEncrypt>()

describe('CreateEmployeeController', () => {
  let sut: CreateEmployeeController
  let createEmployeeUseCase: CreateEmployeeUseCase
  let input: any

  beforeEach(() => {
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, schemaValidator, uuidGenerator, encryptoPassword)
    sut = new CreateEmployeeController(createEmployeeUseCase)
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

    const result = await sut.execute({ body: input })

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual({ idEmployee: 'generatedUUID' })
  })

  test('should throw InvalidParamError for duplicate email', async () => {
    employeeRepository.findByEmail.mockResolvedValue({
      id: 'anyId',
      name: 'John Doe',
      email: 'anyEmail',
      cpf: '1234567890',
      password: 'password123',
      createdAt: new Date('2021-09-21T22:00:00.000Z'),
      updatedAt: null,
      deletedAt: null
    })
    const result = await sut.execute({ body: input })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      error: 'InvalidParamError',
      message: 'Invalid param: Email already in use'
    })
  })

  test('should throw InvalidParamError for duplicate cpf', async () => {
    employeeRepository.findByCpf.mockResolvedValue({
      id: 'anyId',
      name: 'John Doe',
      email: 'anyEmail',
      cpf: '1234567890',
      password: 'password123',
      createdAt: new Date('2021-09-21T22:00:00.000Z'),
      updatedAt: null,
      deletedAt: null
    })
    const result = await sut.execute({ body: input })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      error: 'InvalidParamError',
      message: 'Invalid param: CPF already in use'
    })
  })

  test('should throw SchemaValidationError for invalid input', async () => {
    const inputInvalid = {
      name: 'John Doe',
      email: 'john@email.com',
      cpf: '12345',
      password: 'password123'
    }
    schemaValidator.validate.mockReturnValue({
      value: {
        message: '"cpf" length must be 11 characters long'
      },
      error: 'SchemaValidationError'
    })
    const result = await sut.execute({ body: inputInvalid })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      error: 'SchemaValidationError',
      message: undefined
    })
  })

  test('should throw ServerError', async () => {
    const error = new ServerError()

    employeeRepository.create.mockRejectedValue(error)
    const result = await sut.execute({ body: input })

    expect(result.statusCode).toBe(500)
  })
})
