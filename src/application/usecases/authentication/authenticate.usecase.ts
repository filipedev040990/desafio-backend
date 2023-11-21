import { UserAllInfoOutput, UserRepositoryInterface } from '@/application/interfaces/repositories'
import { AuthenticateUseCaseInterface } from './authenticate.types'
import { InvalidParamError, MissingParamError, UnauthorizedError } from '@/shared/errors'
import { isValidEmail } from '@/shared/helpers'
import { HasherInterface, JwtInterface, UUIDGeneratorInterface } from '@/application/interfaces/tools'
import { TokenRepository } from '@/application/interfaces/repositories/token.repository'

export class AuthenticateUseCase implements AuthenticateUseCaseInterface {
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly hasher: HasherInterface,
    private readonly tokenGenerator: JwtInterface,
    private readonly tokenRepository: TokenRepository,
    private readonly uuidGenerator: UUIDGeneratorInterface
  ) {}

  async execute (input: AuthenticateUseCaseInterface.Input): Promise<AuthenticateUseCaseInterface.Output> {
    this.validateInput(input)

    const user: UserAllInfoOutput = await this.userRepository.getAllInfo(input.email)

    if (!user) {
      throw new UnauthorizedError()
    }

    const passwordIsValid = await this.hasher.compare(input.password, user.password)

    if (!passwordIsValid) {
      throw new UnauthorizedError()
    }

    const token = await this.tokenGenerator.encrypt({
      userId: user.id,
      permissions: user.permissions
    })

    await this.tokenRepository.save({
      id: this.uuidGenerator.generate(),
      userId: user.id,
      token,
      createdAt: new Date()
    })

    return { token }
  }

  private validateInput (input: AuthenticateUseCaseInterface.Input): void {
    if (!input.email) {
      throw new MissingParamError('email')
    }

    if (!input.password) {
      throw new MissingParamError('password')
    }

    if (!isValidEmail(input.email)) {
      throw new InvalidParamError('email')
    }
  }
}
