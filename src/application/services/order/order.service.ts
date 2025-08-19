import { Order, CreateOrderRequest } from '@/domain/entities/order';
import { createPaymentResponse, paymentUtillsInterface, verifyPaymentResponse } from '@/domain/interfaces/utils';
import { OrderRepository } from '@/infrastructure/repository/order.repository';
import { CartRepository } from '@/infrastructure/repository';
import { CustomError, ValidationError } from '@/domain/entities/errors';
import { STATUS_CODES } from '@/domain/entities/status.code';

import { invoiceUtils } from '@/infrastructure/utils';

export class OrderService {
  private orderRepository: OrderRepository;
  private cartRepository: CartRepository;
  private paymentUtils:paymentUtillsInterface
  constructor(orderRepository: OrderRepository, cartRepository: CartRepository,paymentUtils:paymentUtillsInterface) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    this.paymentUtils = paymentUtils;
  }

  async createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order|createPaymentResponse> {
    try {
      // Validate order data
      this.validateOrderData(orderData);
      const order = await this.orderRepository.createOrder({
        ...orderData,
        userId
      });

     if(orderData.paymentInfo.method === "online"){
      const response = await this.paymentUtils.createPayment(orderData.orderSummary.total,order.orderId,userId)
      return response
     }
     else{
      // Create order with generated order ID
      // Clear user's cart after successful order creation
      await this.cartRepository.deleteCart(userId);

      // Set estimated delivery date (7 days from now for delivery, 1 day for pickup)
      if (orderData.deliveryMethod === 'delivery') {
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 7);
        // You could update the order with estimated delivery date here
      }
      return order;      
     }

    } catch (error) {
      throw new CustomError(
        'Failed to create order',
        STATUS_CODES.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
  async verifyOnlinePayment(userId: string, paymentId:string,orderId:string):Promise<verifyPaymentResponse>{
    if(!userId || !paymentId || !orderId) throw new ValidationError()
   const response = await this.paymentUtils.verifyPayment(paymentId)
  if(response.isPayed){
   await this.cartRepository.deleteCart(userId)
   const order = await this.orderRepository.getOrderById(orderId)
   if(!order) throw new ValidationError("invalid order Id")
   if (order.deliveryMethod === 'delivery') {
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + 7);
      }

  }
   return response
  }

  async getOrderById(orderId: string, userId?: string): Promise<Order> {
    const order = await this.orderRepository.getOrderById(orderId);
    
    if (!order) {
      throw new CustomError(
        'Order not found',
        STATUS_CODES.NOT_FOUND,
        `Order with ID ${orderId} does not exist`
      );
    }

    // If userId is provided, ensure the order belongs to the user
    if (userId && order.userId !== userId) {
      throw new CustomError(
        'Unauthorized access to order',
        STATUS_CODES.FORBIDDEN,
        'You do not have permission to view this order'
      );
    }

    return order;
  }

  async getUserOrders(userId: string, limit: number = 10, skip: number = 0): Promise<Order[]> {
    return await this.orderRepository.getOrdersByUserId(userId, limit, skip);
  }

  async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<Order> {
    const updatedOrder = await this.orderRepository.updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      throw new CustomError(
        'Order not found',
        STATUS_CODES.NOT_FOUND,
        `Order with ID ${orderId} does not exist`
      );
    }

    return updatedOrder;
  }

  async updatePaymentStatus(
    orderId: string, 
    paymentStatus: Order['paymentInfo']['paymentStatus'],
    transactionId?: string
  ): Promise<Order> {
    const updatedOrder = await this.orderRepository.updatePaymentStatus(
      orderId, 
      paymentStatus, 
      transactionId
    );
    
    if (!updatedOrder) {
      throw new CustomError(
        'Order not found',
        STATUS_CODES.NOT_FOUND,
        `Order with ID ${orderId} does not exist`
      );
    }

    // If payment is completed, update order status to confirmed
    if (paymentStatus === 'completed' && updatedOrder.orderStatus === 'pending') {
      await this.orderRepository.updateOrderStatus(orderId, 'confirmed');
    }

    return updatedOrder;
  }

  async addTrackingNumber(orderId: string, trackingNumber: string): Promise<Order> {
    const updatedOrder = await this.orderRepository.addTrackingNumber(orderId, trackingNumber);
    
    if (!updatedOrder) {
      throw new CustomError(
        'Order not found',
        STATUS_CODES.NOT_FOUND,
        `Order with ID ${orderId} does not exist`
      );
    }

    return updatedOrder;
  }

  async getOrdersByStatus(status: Order['orderStatus']): Promise<Order[]> {
    return await this.orderRepository.getOrdersByStatus(status);
  }

  async generateInvoiceData(orderId: string): Promise<any> {
    const order = await this.getOrderById(orderId);
    return invoiceUtils.generateInvoiceData(order);
  }

  async generateInvoicePDF(orderId: string): Promise<Buffer> {
    const order = await this.getOrderById(orderId);
    return await invoiceUtils.generateInvoicePDF(order);
  }

  async saveInvoiceToFile(orderId: string, filePath: string): Promise<string> {
    const order = await this.getOrderById(orderId);
    const pdfBuffer = await invoiceUtils.generateInvoicePDF(order);
    await import('fs/promises').then(fs => fs.writeFile(filePath, pdfBuffer));
    return filePath;
  }

  async getInvoiceFilename(orderId: string): Promise<string> {
    const order = await this.getOrderById(orderId);
    return invoiceUtils.generateInvoiceFilename(order);
  }

  // Add new methods for Stripe integration
  async updatePaymentIntentId(orderId: string, paymentIntentId: string): Promise<Order> {
    const updatedOrder = await this.orderRepository.updatePaymentIntentId(orderId, paymentIntentId);
    
    if (!updatedOrder) {
      throw new CustomError(
        'Order not found',
        STATUS_CODES.NOT_FOUND,
        `Order with ID ${orderId} does not exist`
      );
    }

    return updatedOrder;
  }

  async sendOrderConfirmationEmail(orderId: string): Promise<void> {
    try {
      const order = await this.getOrderById(orderId);
      
      // Import email utils
      const { emailUtils } = await import('@/infrastructure/utils/email.utils.js');
      
      // Get customer email from order (assuming userId contains email or you have a user service)
      const customerEmail = order.userId; // You might need to get actual email from user service
      
      // Send email with order and customer email
      await emailUtils.sendOrderConfirmationEmail(order, customerEmail);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      // Don't throw error as this shouldn't block the payment process
    }
  }

  private validateOrderData(orderData: CreateOrderRequest): void {
    if (!orderData.items || orderData.items.length === 0) {
      throw new CustomError(
        'Invalid order data',
        STATUS_CODES.BAD_REQUEST,
        'Order must contain at least one item'
      );
    }

    if (!orderData.shippingAddress || !orderData.shippingAddress.fullName) {
      throw new CustomError(
        'Invalid order data',
        STATUS_CODES.BAD_REQUEST,
        'Shipping address is required'
      );
    }

    if (!orderData.paymentInfo || !orderData.paymentInfo.method) {
      throw new CustomError(
        'Invalid order data',
        STATUS_CODES.BAD_REQUEST,
        'Payment information is required'
      );
    }

    if (orderData.orderSummary.total <= 0) {
      throw new CustomError(
        'Invalid order data',
        STATUS_CODES.BAD_REQUEST,
        'Order total must be greater than zero'
      );
    }
  }
}