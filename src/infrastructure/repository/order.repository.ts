import { Order, CreateOrderRequest } from '../../domain/entities/order';
import { OrderModel } from '../../infrastructure/model/order.model';
import { Types } from 'mongoose';

export class OrderRepository {
  async createOrder(orderData: CreateOrderRequest & { userId: string }): Promise<Order> {
    const order = new OrderModel({
      ...orderData,
      orderDate: new Date(),
      paymentInfo: {
        ...orderData.paymentInfo,
        paymentDate: new Date()
      }
    });
    
    const savedOrder = await order.save();
    return savedOrder.toObject();
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const order = await OrderModel.findOne({ orderId }).lean();
    return order;
  }

  async getOrdersByUserId(userId: string, limit: number = 10, skip: number = 0): Promise<Order[]> {
    const orders = await OrderModel
      .find({ userId })
      .sort({ orderDate: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    return orders;
  }

  async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<Order | null> {
    const updatedOrder = await OrderModel
      .findOneAndUpdate(
        { orderId },
        { orderStatus: status },
        { new: true }
      )
      .lean();
    return updatedOrder;
  }

  async updatePaymentStatus(
    orderId: string, 
    paymentStatus: Order['paymentInfo']['paymentStatus'],
    transactionId?: string
  ): Promise<Order | null> {
    const updateData: any = { 'paymentInfo.paymentStatus': paymentStatus };
    if (transactionId) {
      updateData['paymentInfo.transactionId'] = transactionId;
    }

    const updatedOrder = await OrderModel
      .findOneAndUpdate(
        { orderId },
        updateData,
        { new: true }
      )
      .lean();
    return updatedOrder;
  }

  async addTrackingNumber(orderId: string, trackingNumber: string): Promise<Order | null> {
    const updatedOrder = await OrderModel
      .findOneAndUpdate(
        { orderId },
        { trackingNumber, orderStatus: 'shipped' },
        { new: true }
      )
      .lean();
    return updatedOrder;
  }

  async updatePaymentIntentId(orderId: string, paymentIntentId: string): Promise<Order | null> {
    const updatedOrder = await OrderModel
      .findOneAndUpdate(
        { orderId },
        { 
          'paymentInfo.paymentIntentId': paymentIntentId,
          'paymentInfo.paymentStatus': 'processing'
        },
        { new: true }
      )
      .lean();
    return updatedOrder;
  }

  async getOrdersByStatus(status: Order['orderStatus'], limit: number = 50): Promise<Order[]> {
    const orders = await OrderModel
      .find({ orderStatus: status })
      .sort({ orderDate: -1 })
      .limit(limit)
      .lean();
    return orders;
  }

  async getTotalOrdersCount(userId?: string): Promise<number> {
    const filter = userId ? { userId } : {};
    return await OrderModel.countDocuments(filter);
  }

  async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    const matchStage: any = {
      'paymentInfo.paymentStatus': 'completed'
    };

    if (startDate || endDate) {
      matchStage.orderDate = {};
      if (startDate) matchStage.orderDate.$gte = startDate;
      if (endDate) matchStage.orderDate.$lte = endDate;
    }

    const result = await OrderModel.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: '$orderSummary.total' } } }
    ]);

    return result[0]?.total || 0;
  }

  async getOrdersWithFilters(filters: {
      startDate?: Date;
      endDate?: Date;
      status?: string;
      limit?: number;
      skip?: number;
  }): Promise<Order[]> {
      const matchStage: any = {};
      
      // Date range filter
      if (filters.startDate || filters.endDate) {
          matchStage.orderDate = {};
          if (filters.startDate) matchStage.orderDate.$gte = filters.startDate;
          if (filters.endDate) matchStage.orderDate.$lte = filters.endDate;
      }
      
      // Status filter
      if (filters.status) {
          matchStage.orderStatus = filters.status;
      }
      
      const orders = await OrderModel
          .find(matchStage)
          .sort({ orderDate: -1 })
          .limit(filters.limit || 100)
          .skip(filters.skip || 0)
          .lean();
          
      return orders;
  }
}