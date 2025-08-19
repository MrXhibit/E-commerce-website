import { Router } from 'express';
import { OrderController } from '@/presentation/controller/order/order.controller';
import { OrderService } from '@/application/services/order/order.service';
import { OrderRepository } from '@/infrastructure/repository/order.repository';
import { CartRepository } from '@/infrastructure/repository';
import { userRepository } from '@/infrastructure/repository/user.repository';
import { authenticateUser } from '@/presentation/middleware/auth.middleware';
import { paymentUtills } from '@/infrastructure/utils'

const router = Router();

// Initialize services
const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
const userRepositoryInstance = new userRepository();
const orderService = new OrderService(orderRepository, cartRepository,paymentUtills);
const orderController = new OrderController();

// Order routes
router.post('/', authenticateUser, (req, res, next) => 
  orderController.createOrder(req, res, next)
);

router.get('/', authenticateUser, (req, res, next) => 
  orderController.getUserOrders(req, res, next)
);

router.get('/:orderId', authenticateUser, (req, res, next) => 
  orderController.getOrderById(req, res, next)
);

router.patch('/:orderId/status', authenticateUser, (req, res, next) => 
  orderController.updateOrderStatus(req, res, next)
);

router.patch('/:orderId/payment-status', authenticateUser, (req, res, next) => 
  orderController.updatePaymentStatus(req, res, next)
);

router.post('/:orderId/tracking', authenticateUser, (req, res, next) => 
  orderController.addTrackingNumber(req, res, next)
);

router.get('/:orderId/invoice', authenticateUser, (req, res, next) => 
  orderController.getOrderInvoice(req, res, next)
);

export default router;