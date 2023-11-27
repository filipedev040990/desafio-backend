import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateUserUseCaseInterface } from './update-user.types'
import { UpdateUserRepositoryInput, UserRepositoryInterface } from '@/application/interfaces/repositories'
import { isValidEmail, isValidString } from '@/shared/helpers'
import { HasherInterface } from '@/application/interfaces/tools'
import { PermissionRepositoryInterface } from '@/application/interfaces/repositories/permission.repository.interface'

export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  private repositoryInput: UpdateUserRepositoryInput = { id: '', updatedAt: new Date() }

  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashGenerator: HasherInterface,
    private readonly permissionRepository: PermissionRepositoryInterface
  ) {}

  async execute (input: UpdateUserUseCaseInterface.Input): Promise<void> {
    await this.validateInput(input)
    await this.userRepository.update(this.repositoryInput)
  }

  private async validateInput (input: UpdateUserUseCaseInterface.Input): Promise<void> {
    if (!input?.name && !input?.email && !input?.password && (input?.active === undefined) && !input?.permissions?.length) {
      throw new MissingParamError('Payload is empty')
    }

    if (!input?.id) {
      throw new MissingParamError('id')
    }

    const user = await this.userRepository.getById(input.id)
    if (!user) {
      throw new InvalidParamError('User not found')
    }

    this.repositoryInput.id = input.id

    if (input?.email) {
      if (!isValidEmail(input.email)) {
        throw new InvalidParamError('email')
      }

      const emailExists = await this.userRepository.getByEmail(input.email)
      if (emailExists && emailExists.id !== input.id) {
        throw new InvalidParamError('This email is already in use')
      }

      this.repositoryInput.email = input.email
    }

    if (input?.name) {
      if (!isValidString(input.name)) {
        throw new InvalidParamError('name')
      }
      this.repositoryInput.name = input.name
    }

    if (input?.password) {
      this.repositoryInput.password = await this.hashGenerator.hash(input.password)
    }

    if (input.active !== undefined && input.active !== null) {
      if (typeof input.active !== 'boolean') {
        throw new InvalidParamError('This status should be a boolean')
      }
      this.repositoryInput.active = input.active
    }

    if (input?.permissions && input?.permissions?.length) {
      const permissionsCode = await this.permissionRepository.getPermissionsCode()
      if (!permissionsCode) {
        throw new InvalidParamError('Permissions not found')
      }

      for (const permission of input.permissions) {
        if (typeof permission !== 'number' || !permissionsCode.includes(permission)) {
          throw new InvalidParamError('permissions')
        }
      }

      this.repositoryInput.permissions = input.permissions.join(',')
    }
  }
}
