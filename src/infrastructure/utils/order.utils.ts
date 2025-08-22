import { ValidationError } from "@/domain/entities";
import { orderUtillsInterface } from "@/domain/interfaces/utils/order.utills.interface";
import { createOrderRequest } from "@/domain/types";
import { createOrderSchema } from "./validator/create.order.validator";

    const createOrderRequestValidator = (reqBoy: any): createOrderRequest=>{
    const { error } = createOrderSchema.validate(reqBoy);
    if (error) throw new ValidationError(error.details[0].message);
    else return {
          addressId: reqBoy.addressId,
          paymentMethod: reqBoy.paymentMethod,
         coupon: reqBoy.coupon
        }
    }


export const orderUtils:orderUtillsInterface = {
    createOrderRequestValidator
}