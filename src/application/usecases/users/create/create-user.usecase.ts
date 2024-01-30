import { UUIDGeneratorInterface, HasherInterface } from '@/application/interfaces/tools'
import { CreateUserUseCaseInterface } from './create-user.types'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { isValidEmail, isValidString } from '@/shared/helpers'
import { PermissionRepositoryInterface, UserRepositoryInterface } from '@/application/interfaces/repositories'
import { DEFAULT_USER_INITIAL_STATUS } from '@/shared/constants'

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly uuidGenerator: UUIDGeneratorInterface,
    private readonly hashGenerator: HasherInterface,
    private readonly permissionRepository: PermissionRepositoryInterface
  ) {
  }

  async execute (input: CreateUserUseCaseInterface.Input): Promise<CreateUserUseCaseInterface.Output> {
    await this.validate(input)

    const userId = await this.userRepository.create({
      id: this.uuidGenerator.generate(),
      name: input.name,
      email: input.email,
      password: await this.hashGenerator.hash(input.password),
      active: DEFAULT_USER_INITIAL_STATUS,
      permissions: input.permissions.join(','),
      createdAt: new Date()
    })

    return {
      id: userId
    }
  }

  private async validate (input: CreateUserUseCaseInterface.Input): Promise<void> {
    const requiredFields: Array<keyof Omit<CreateUserUseCaseInterface.Input, 'permissions'>> = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!isValidString(input[field])) {
        throw new MissingParamError(field)
      }
    }

    await this.validatePermission(input.permissions)

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

  async validatePermission (permissions: number[]): Promise<void> {
    if (!permissions || permissions.length < 1) {
      throw new MissingParamError('permissions')
    }

    const permissionsCodes: number [] = await this.permissionRepository.getAllPermissionsCode()
    const invalidPermissions: number [] = permissions.filter((permission) => !permissionsCodes.includes(permission))

    if (invalidPermissions.length > 0) {
      throw new InvalidParamError(`permission ${invalidPermissions[0]}`)
    }
  }
}
