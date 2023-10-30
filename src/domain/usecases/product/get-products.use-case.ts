import { ServerError } from '../../../shared/errors'
import { IProductRepository } from '../../../ports/repositories/product.port'
import { IGetProductsUseCase } from '../../../ports/usecases/product/get-products.port'

export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async execute(): Promise<IGetProductsUseCase.Output[]> {
    const products = await this.productRepository.getAll()
    if (!products) {
      throw new ServerError()
    }
    return products
  }
}
