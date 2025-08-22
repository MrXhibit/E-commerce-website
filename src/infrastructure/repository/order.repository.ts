import { addressProperties, APIError, Order,orderItem, orderProperties, userProperties, ValidationError } from "@/domain/entities";
import { OrderRepositoryInterface } from "@/domain/interfaces/repository/order.repository.interface";
import OrderModel,{IOrder} from "../model/order.model";
import mongoose from "mongoose";
import { IProduct, IUser } from "../model";
import { IAddress } from "../model/address.model";

export class OrderRepository implements OrderRepositoryInterface {
  async create(order: Order): Promise<Order> {
    try {
      const newOrder = new OrderModel({
        items: order.items,
       address: order.address,
       user: order.user,
       paymentInfo: order.paymentInfo,
       orderStatus: order.orderStatus,
       appliedCoupon:order.appliedCoupon
      })
      await newOrder.save()
      const populatedOrder = await OrderModel.findById(newOrder.id).populate('address').populate('user')
      return this.mapToOrder(populatedOrder!)
    } catch (error) {
      throw new APIError()
    }
  }
  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.findById(id).populate('items.productId').populate('address')
    if(!order) throw new ValidationError()
    return this.mapToOrder(order)
  }
  findByUserId(userId: string): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
  findByStatus(status: string): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
  async update(order:Order): Promise<Order | null> {
        try {
          const modifiedFields = order.modifiedFields;
          if (Object.keys(modifiedFields).length === 0) throw new ValidationError();
          const updatedFields: Record<keyof Omit<orderProperties,"id"|"user" |  "items">, any> = {} as Record<
            keyof Omit<orderProperties,"id"|"user" | "items">, any>
          for (const key in modifiedFields) {
            if (modifiedFields.hasOwnProperty(key)) {
              const fieldKey = key as keyof Omit<orderProperties,"id"|"user" |  "items">;
              if (modifiedFields[fieldKey]) {
                updatedFields[fieldKey] = order[fieldKey];
              }
            }
          }
          if (updatedFields.updatedAt) delete updatedFields.updatedAt;
          await OrderModel.findByIdAndUpdate(order.id, updatedFields);
          order.clearModifiedFields;
          const updatedOrder = await this.findById(order.id)
          return updatedOrder;
        } catch (error) {
          throw new APIError();
        }
    
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  mapToOrder(orderDb: IOrder): Order {
    const items = [] as orderItem[]
    let address:string | Partial<addressProperties> 
    let user:string | Partial<userProperties>
    orderDb.items.forEach((item)=>{
      const orderItem = {} as orderItem
      if(mongoose.isValidObjectId(item.productId)){
        orderItem.productId = item.productId.toString()
      }else{
        const dbItem = item.productId as IProduct
        orderItem.productId = dbItem.id
      }
       orderItem.price = item.price
        orderItem.quantity = item.quantity
        orderItem.totalPrice = item.totalPrice
        items.push(orderItem)
    })
    if(mongoose.isValidObjectId(orderDb.address)){
       address = orderDb.address.toString()
    }else{
       const addressProp = {} as addressProperties
       const dbAdress = orderDb.address as IAddress
       addressProp.addressLine1 = dbAdress.addressLine1
       addressProp.id = dbAdress.id
       addressProp.city = dbAdress.city
       addressProp.country = dbAdress.country
       addressProp.fullName = dbAdress.fullName
       address = addressProp
    }
      if(mongoose.isValidObjectId(orderDb.user)){
       user = orderDb.user.toString()
    }else{
       const userProp = {} as userProperties
       const dbUser = orderDb.user as IUser
       userProp.id = dbUser.id
       userProp.email = dbUser.email
       user = userProp
    }
    const order = new Order(orderDb.id,items,address,user,orderDb.paymentInfo.method,orderDb.paymentInfo.payableAmount)
    order.paymentInfo = orderDb.paymentInfo
    order.orderStatus = orderDb.orderStatus
    return order
  }
  
  // async createOrder(orderData: CreateOrderRequest & { userId: string }): Promise<Order> {
  //   const order = new OrderModel({
  //     ...orderData,
  //     orderDate: new Date(),
  //     paymentInfo: {
  //       ...orderData.paymentInfo,
  //       paymentDate: new Date()
  //     }
  //   });
    
  //   const savedOrder = await order.save();
  //   return savedOrder.toObject();
  // }

  // async getOrderById(orderId: string): Promise<Order | null> {
  //   const order = await OrderModel.findOne({ orderId }).lean();
  //   return order;
  // }

  // async getOrdersByUserId(userId: string, limit: number = 10, skip: number = 0): Promise<Order[]> {
  //   const orders = await OrderModel
  //     .find({ userId })
  //     .sort({ orderDate: -1 })
  //     .limit(limit)
  //     .skip(skip)
  //     .lean();
  //   return orders;
  // }

  // async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<Order | null> {
  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       { orderStatus: status },
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async updatePaymentStatus(
  //   orderId: string, 
  //   paymentStatus: Order['paymentInfo']['paymentStatus'],
  //   transactionId?: string
  // ): Promise<Order | null> {
  //   const updateData: any = { 'paymentInfo.paymentStatus': paymentStatus };
  //   if (transactionId) {
  //     updateData['paymentInfo.transactionId'] = transactionId;
  //   }

  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       updateData,
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async addTrackingNumber(orderId: string, trackingNumber: string): Promise<Order | null> {
  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       { trackingNumber, orderStatus: 'shipped' },
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async updatePaymentIntentId(orderId: string, paymentIntentId: string): Promise<Order | null> {
  //   const updatedOrder = await OrderModel
  //     .findOneAndUpdate(
  //       { orderId },
  //       { 
  //         'paymentInfo.paymentIntentId': paymentIntentId,
  //         'paymentInfo.paymentStatus': 'processing'
  //       },
  //       { new: true }
  //     )
  //     .lean();
  //   return updatedOrder;
  // }

  // async getOrdersByStatus(status: Order['orderStatus'], limit: number = 50): Promise<Order[]> {
  //   const orders = await OrderModel
  //     .find({ orderStatus: status })
  //     .sort({ orderDate: -1 })
  //     .limit(limit)
  //     .lean();
  //   return orders;
  // }

  // async getTotalOrdersCount(userId?: string): Promise<number> {
  //   const filter = userId ? { userId } : {};
  //   return await OrderModel.countDocuments(filter);
  // }

  // async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
  //   const matchStage: any = {
  //     'paymentInfo.paymentStatus': 'completed'
  //   };

  //   if (startDate || endDate) {
  //     matchStage.orderDate = {};
  //     if (startDate) matchStage.orderDate.$gte = startDate;
  //     if (endDate) matchStage.orderDate.$lte = endDate;
  //   }

  //   const result = await OrderModel.aggregate([
  //     { $match: matchStage },
  //     { $group: { _id: null, total: { $sum: '$orderSummary.total' } } }
  //   ]);

  //   return result[0]?.total || 0;
  // }
}