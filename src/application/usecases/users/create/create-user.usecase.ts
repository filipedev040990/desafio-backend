import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { CreateUserUseCaseInterface } from './create-user.types'
import { isValidEmail, isValidString } from '@/shared/helpers'
import { UserRepository } from '@/application/repositories'
import { UUIDGeneratorInterface } from '@/application/adapters/uuid.interface'
import { HasherInterface } from '@/application/adapters/encrypt.interface'
import { JwtInterface } from '@/application/adapters/jwt.interface'

type InputRequiredFields = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly uuidGenerator: UUIDGeneratorInterface,
    private readonly hashGenerator: HasherInterface,
    private readonly tokenGenerator: JwtInterface
  ) {
  }

  async execute (input: CreateUserUseCaseInterface.Input): Promise<CreateUserUseCaseInterface.Output> {
    await this.validate(input)

    const userId = await this.userRepository.create({
      id: this.uuidGenerator.generate(),
      name: input.name,
      email: input.email,
      password: this.hashGenerator.hash(input.password),
      permissions: input.permissions
    })

    const accessToken = await this.tokenGenerator.encrypt({ userId })

    return {
      id: userId,
      access_token: accessToken
    }
  }

  private async validate (input: CreateUserUseCaseInterface.Input): Promise<void> {
    const requiredFields: Array<keyof InputRequiredFields> = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!isValidString(input[field])) {
        throw new MissingParamError(field)
      }
    }

    if (!input.permissions || input.permissions.length < 1) {
      throw new MissingParamError('permissions')
    }

    if (input.password !== input.passwordConfirmation) {
      throw new InvalidParamError('passwordConfirmation')
    }

    if (!isValidEmail(input.email)) {
      throw new InvalidParamError('email')
    }

    const emailExists = await this.userRepository.getByEmail(input.email)
    if (emailExists) {
      throw new InvalidParamError('This email is already in use')
    }
  }
}
