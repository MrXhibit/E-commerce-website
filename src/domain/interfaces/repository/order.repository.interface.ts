import { Order } from '@/domain/entities/order';

export interface OrderRepositoryInterface {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findByStatus(status: string): Promise<Order[]>;
  update(order:Order): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  mapToOrder(orderDb:unknown):Order
}