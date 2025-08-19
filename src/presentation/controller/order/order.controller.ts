import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@/application/services/order/order.service';
import { OrderRepository } from '@/infrastructure/repository/order.repository';
import { CartRepository } from '@/infrastructure/repository';
import { ResponseUtils,paymentUtills } from '@/infrastructure/utils';
import { CreateOrderRequest } from '@/domain/entities';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    const orderRepository = new OrderRepository();
    const cartRepository = new CartRepository();
    this.orderService = new OrderService(orderRepository, cartRepository,paymentUtills);
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const orderData: CreateOrderRequest = req.body;
      const order = await this.orderService.createOrder(userId, orderData);

      res.status(201).json(
        ResponseUtils.success(order, 'Order created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const user = req.user as any;
      const userId = user?.id;

      const order = await this.orderService.getOrderById(orderId, userId);

      res.status(200).json(
        ResponseUtils.success(order, 'Order retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;
      const userId = user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;

      const orders = await this.orderService.getUserOrders(userId, limit, skip);

      res.status(200).json(
        ResponseUtils.success(orders, 'Orders retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await this.orderService.updateOrderStatus(orderId, status);

      res.status(200).json(
        ResponseUtils.success(order, 'Order status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { paymentStatus, transactionId } = req.body;

      const order = await this.orderService.updatePaymentStatus(
        orderId, 
        paymentStatus, 
        transactionId
      );

      res.status(200).json(
        ResponseUtils.success(order, 'Payment status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async addTrackingNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { trackingNumber } = req.body;

      const order = await this.orderService.addTrackingNumber(orderId, trackingNumber);

      res.status(200).json(
        ResponseUtils.success(order, 'Tracking number added successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async getOrderInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const user = req.user as any;
      const userId = user?.id;

      // Verify user owns this order
      const order = await this.orderService.getOrderById(orderId, userId);
      const invoiceData = await this.orderService.generateInvoiceData(orderId);

      res.status(200).json(
        ResponseUtils.success(invoiceData, 'Invoice data retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  async downloadInvoicePDF(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const user = req.user as any;
      const userId = user?.id;

      // Verify user owns this order
      await this.orderService.getOrderById(orderId, userId);
      
      const pdfBuffer = await this.orderService.generateInvoicePDF(orderId);
      const filename = await this.orderService.getInvoiceFilename(orderId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  async viewInvoicePDF(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const user = req.user as any;
      const userId = user?.id;

      // Verify user owns this order
      await this.orderService.getOrderById(orderId, userId);
      
      const pdfBuffer = await this.orderService.generateInvoicePDF(orderId);
      const filename = await this.orderService.getInvoiceFilename(orderId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoint for downloading any invoice
  async adminDownloadInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      
      const pdfBuffer = await this.orderService.generateInvoicePDF(orderId);
      const filename = await this.orderService.getInvoiceFilename(orderId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  async getOrdersByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.params;
      const orders = await this.orderService.getOrdersByStatus(status as any);

      res.status(200).json(
        ResponseUtils.success(orders, `Orders with status '${status}' retrieved successfully`)
      );
    } catch (error) {
      next(error);
    }
  }
}