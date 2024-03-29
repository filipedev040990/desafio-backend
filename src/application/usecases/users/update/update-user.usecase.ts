import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateUserUseCaseInterface } from './update-user.types'
import { PermissionRepositoryInterface, UpdateUserRepositoryInput, UserRepositoryInterface } from '@/application/interfaces/repositories'
import { isValidEmail, isValidString } from '@/shared/helpers'
import { HasherInterface } from '@/application/interfaces/tools'
import { UPDATE_ANOTHER_USER_PERMISSION } from '@/shared/constants'

export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  private repositoryInput: UpdateUserRepositoryInput = { id: '', updatedAt: new Date() }

  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashGenerator: HasherInterface,
    private readonly permissionRepository: PermissionRepositoryInterface) {}

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
      if (typeof input.active !== 'number') {
        throw new InvalidParamError('This status should be a boolean')
      }
      this.repositoryInput.active = input.active
    }

    if (input?.permissions && input?.permissions?.length) {
      await this.validatePermission(input.permissions)
    }

    if (input.authenticatedUser.id !== input.id) {
      this.canUpdateAnotherUser(input)
    }
  }

  async validatePermission (permissions: number[]): Promise<void> {
    const permissionsCodes: number [] = await this.permissionRepository.getAllPermissionsCode()
    const invalidPermissions: number [] = permissions.filter((permission) => !permissionsCodes.includes(permission))

    if (invalidPermissions.length > 0) {
      throw new InvalidParamError(`permission ${invalidPermissions.join(',')}`)
    }

    for (const permission of permissions) {
      if (typeof permission !== 'number') {
        throw new InvalidParamError('permissions')
      }
    }

    this.repositoryInput.permissions = permissions.join(',')
  }

  canUpdateAnotherUser (input: UpdateUserUseCaseInterface.Input): void {
    if (!input.authenticatedUser.permissions.includes(UPDATE_ANOTHER_USER_PERMISSION)) {
      throw new InvalidParamError('You do not have permission to update this user')
    }
  }
}
