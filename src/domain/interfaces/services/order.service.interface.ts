import { orderProperties } from "@/domain/entities";
import { createPaymentResponse } from "../utils";

export interface OrderServiceInterface{
    createOrder(userToken:string,reqBody:unknown):Promise<orderProperties|createPaymentResponse>
    verifyOnlinePayment(userToken:string,paymentId:string):Promise<orderProperties>
    getOrderById(userToken:string,orderId:string):Promise<orderProperties>

}