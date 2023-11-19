import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { UpdateUserUseCaseInterface } from './update-user.types'
import { UpdateUserRepositoryInput, UserRepositoryInterface } from '@/application/interfaces/repositories'
import { isValidEmail, isValidString } from '@/shared/helpers'
import { HasherInterface } from '@/application/interfaces/tools'

export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  private repositoryInput: UpdateUserRepositoryInput = { id: '', updatedAt: new Date() }

  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashGenerator: HasherInterface) {}

  async execute (input: UpdateUserUseCaseInterface.Input): Promise<void> {
    this.handleInput(input)
    await this.handleId(input?.id)
    await this.handleEmail(input?.email)
    await this.handlePassword(input?.password)
    this.handleActive(input?.active)
    this.handleName(input?.name)
    this.handlePermissions(input?.permissions)

    await this.userRepository.update(this.repositoryInput)
  }

  private async handleId (id?: string): Promise<void> {
    if (!id) {
      throw new MissingParamError('id')
    }

    const user = await this.userRepository.getById(id)
    if (!user) {
      throw new InvalidParamError('User not found')
    }

    this.repositoryInput.id = id
  }

  private async handleEmail (email?: string, id?: string): Promise<void> {
    if (email) {
      if (!isValidEmail(email)) {
        throw new InvalidParamError('email')
      }

      const emailExists = await this.userRepository.getByEmail(email)
      if (emailExists && emailExists.id !== id) {
        throw new InvalidParamError('This email is already in use')
      }

      this.repositoryInput.email = email
    }
  }

  private handleName (name?: string): void {
    if (name) {
      if (!isValidString(name)) {
        throw new InvalidParamError('name')
      }
      this.repositoryInput.name = name
    }
  }

  private async handlePassword (password?: any): Promise<void> {
    if (password) {
      this.repositoryInput.password = await this.hashGenerator.hash(password)
    }
  }

  private handleActive (active?: boolean): void {
    if (active) {
      if (typeof active !== 'boolean') {
        throw new InvalidParamError('This status should be a boolean')
      }
      this.repositoryInput.active = active
    }
  }

  private handlePermissions (permissions?: number []): void {
    if (permissions && permissions?.length) {
      for (const permission of permissions) {
        if (typeof permission !== 'number') {
          throw new InvalidParamError('permissions')
        }
      }

      this.repositoryInput.permissions = permissions.join(',')
    }
  }

  private handleInput (input: UpdateUserUseCaseInterface.Input): void {
    if (!input?.name && !input?.email && !input?.password && !input?.active && !input?.permissions?.length) {
      throw new MissingParamError('Only id is provided')
    }
  }
}
