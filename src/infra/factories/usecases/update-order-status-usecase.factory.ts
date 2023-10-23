import { UpdateOrderStatusUseCase } from '../../../domain/usecases/order/update-order-status.usecase'
import { OrderRepository } from '../../database/repositories/order.repository'

export const makeUpdateOrderStatusUseCase = (): UpdateOrderStatusUseCase => {
  const orderRepository = new OrderRepository()
  return new UpdateOrderStatusUseCase(orderRepository)
}
