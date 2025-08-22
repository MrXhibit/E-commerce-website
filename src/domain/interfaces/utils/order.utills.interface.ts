import { createOrderRequest } from "@/domain/types";

export interface orderUtillsInterface{
    createOrderRequestValidator(reqBoy:any):createOrderRequest
}