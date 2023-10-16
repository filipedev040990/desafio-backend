import { OrderOutput } from '../../../domain/types'
import { DeleteOrderUseCase } from './delete-order.usecase'
import { IOrderRepository } from '@/ports'
import { mock } from 'jest-mock-extended'

const orderRepository = mock<IOrderRepository>()
const orderOutput: OrderOutput = {
  id: 'anyOrderId',
  orderNumber: 'anyOrderNumber',
  clientId: 'anyClientId',
  clientDocument: null,
  status: 'finalized',
  totalValue: 4500,
  createdAt: new Date('2023-10-12 16:55:27'),
  paidAt: new Date('2023-10-12 17:13:26'),
  client: {
    name: 'anyClientName',
    email: 'anyClientEmail',
    cpf: 'anyClientCpf'
  },
  products: [{
    id: 'anyProductId',
    name: 'anyProductName',
    category: 'anyCategoryProduct',
    price: 1700,
    description: 'anyDescriptionProduct',
    image: 'anyImageProduct',
    amount: 3
  }]
}

describe('DeleteOrderUseCase', () => {
  let sut: DeleteOrderUseCase

  beforeEach(() => {
    sut = new DeleteOrderUseCase(orderRepository)
    orderRepository.getByOrderNumber.mockResolvedValue(orderOutput)
  })

  test('should call OrderRepository.getOrderByNumber once and with correct orderNumber', async () => {
    await sut.execute('anyOrderNumber')

    expect(orderRepository.getByOrderNumber).toHaveBeenCalledTimes(1)
    expect(orderRepository.getByOrderNumber).toHaveBeenCalledWith('anyOrderNumber')
  })

  test('should call OrderRepository.delete once and with correct orderNumber', async () => {
    await sut.execute('anyOrderNumber')

    expect(orderRepository.delete).toHaveBeenCalledTimes(1)
    expect(orderRepository.delete).toHaveBeenCalledWith('anyOrderNumber')
  })

  test('should not call OrderRepository.delete if orderNumber is invalid', async () => {
    orderRepository.getByOrderNumber.mockResolvedValueOnce(null)

    await sut.execute('anyOrderNumber')

    expect(orderRepository.delete).toHaveBeenCalledTimes(0)
  })
})
