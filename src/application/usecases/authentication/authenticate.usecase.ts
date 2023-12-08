import { UserAllInfoOutput, UserRepositoryInterface } from '@/application/interfaces/repositories'
import { AuthenticateUseCaseInterface } from './authenticate.types'
import { InvalidParamError, MissingParamError, UnauthorizedError } from '@/shared/errors'
import { isValidEmail } from '@/shared/helpers'
import { HasherInterface, JwtInterface, UUIDGeneratorInterface } from '@/application/interfaces/tools'
import { TokenRepositoryInterface } from '@/application/interfaces/repositories/token.repository'

export class AuthenticateUseCase implements AuthenticateUseCaseInterface {
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly hasher: HasherInterface,
    private readonly jwtToken: JwtInterface,
    private readonly tokenRepository: TokenRepositoryInterface,
    private readonly uuidGenerator: UUIDGeneratorInterface
  ) {}

  async execute (input: AuthenticateUseCaseInterface.Input): Promise<AuthenticateUseCaseInterface.Output> {
    this.validateInput(input)

    const user: UserAllInfoOutput = await this.userRepository.getAllInfo(input.email)

    if (!user || !user.active) {
      throw new UnauthorizedError()
    }

    const passwordIsValid = await this.hasher.compare(input.password, user.password)

    if (!passwordIsValid) {
      throw new UnauthorizedError()
    }

    const token = await this.getToken(user)

    return { token, userId: user.id }
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

  private async getToken (user: UserAllInfoOutput): Promise<string> {
    let token = await this.tokenRepository.getByUserId(user!.id)

    const generateToken = async (userId: string, permissions: number []): Promise<string> => {
      return await this.jwtToken.encrypt({
        userId,
        permissions
      })
    }

    const updateToken = async (user: UserAllInfoOutput): Promise<string> => {
      token = await generateToken(user!.id, user!.permissions)
      await this.tokenRepository.update({
        userId: user!.id,
        token,
        updatedAt: new Date()
      })
      return token
    }

    const saveToken = async (user: UserAllInfoOutput): Promise<string> => {
      token = await generateToken(user!.id, user!.permissions)
      await this.tokenRepository.save({
        id: this.uuidGenerator.generate(),
        userId: user!.id,
        token,
        createdAt: new Date()
      })
      return token
    }

    if (!token) {
      return await saveToken(user)
    }

    const isValidToken = await this.jwtToken.decrypt(token)
    if (isValidToken) {
      return token
    }

    return await updateToken(user)
  }
}
