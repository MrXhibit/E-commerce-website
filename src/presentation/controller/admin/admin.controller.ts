import { Request, Response, NextFunction } from "express";
import { authUtills } from "@/infrastructure/utils";
import { tokenUtils } from "@/infrastructure/utils/token.utils";
import { adminRepository } from "@/infrastructure/repository/admin.repository";
import { adminService } from "@/application/services/admin/admin.service";
import { OrderRepository } from "@/infrastructure/repository/order.repository";
import { ResponseUtils } from "@/infrastructure/utils/response.utils";

const adminRepo = new adminRepository();
const adminServ = new adminService(adminRepo, tokenUtils, authUtills);
const orderRepo = new OrderRepository();


export const getCurentAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const token = req.cookies.access_token_admin;
      const admin = await adminServ.getcurentAdmin(token)
      return res.status(200).json({admin})  
    } catch (error) {
        next(error)
    }
}

export const adminLogout = async(req:Request,res:Response,next:NextFunction)=>{
    try {
     const token = req.cookies.access_token_admin;
     const admin = await adminServ.logOutAdmin(token)
      res.cookie("access_token_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.cookie("refresh_token_admin","", {
      httpOnly: true,
      expires:new Date(0),
    });
  return res.status(200).json({admin})  
     
    } catch (error) {
       next(error) 
    }
}

export const getSalesReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate, status, limit = 100, skip = 0 } = req.query;
        
        // Parse dates if provided
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;
        
        // Get orders with filters
        const orders = await orderRepo.getOrdersWithFilters({
            startDate: start,
            endDate: end,
            status: status as string,
            limit: parseInt(limit as string),
            skip: parseInt(skip as string)
        });
        
        // Calculate summary statistics
        const totalRevenue = await orderRepo.getTotalRevenue(start, end);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Group orders by status
        const ordersByStatus = orders.reduce((acc, order) => {
            acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        // Group revenue by date
        const revenueByDate = orders.reduce((acc, order) => {
            const date = order.orderDate.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + order.orderSummary.total;
            return acc;
        }, {} as Record<string, number>);
        
        const salesData = {
            summary: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                ordersByStatus,
                revenueByDate
            },
            orders: orders.map(order => ({
                orderId: order.orderId,
                userId: order.userId,
                orderDate: order.orderDate,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentInfo.paymentStatus,
                paymentMethod: order.paymentInfo.method,
                subtotal: order.orderSummary.subtotal,
                tax: order.orderSummary.tax,
                deliveryFee: order.orderSummary.deliveryFee,
                discountAmount: order.orderSummary.discountAmount,
                total: order.orderSummary.total,
                itemCount: order.items.length,
                customerName: order.shippingAddress.fullName,
                customerPhone: order.shippingAddress.phone
            }))
        };
        
        return res.status(200).json(ResponseUtils.success(salesData, 'Sales reports retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

export const exportSalesReportsCSV = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate, status } = req.query;
        
        // Parse dates if provided
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;
        
        // Get all orders for export (no pagination)
        const orders = await orderRepo.getOrdersWithFilters({
            startDate: start,
            endDate: end,
            status: status as string,
            limit: 10000, // Large limit for export
            skip: 0
        });
        
        // Create CSV headers
        const headers = [
            'Order ID',
            'User ID', 
            'Order Date',
            'Order Status',
            'Payment Status',
            'Payment Method',
            'Customer Name',
            'Customer Phone',
            'Item Count',
            'Subtotal',
            'Tax',
            'Delivery Fee',
            'Discount',
            'Total'
        ];
        
        // Create CSV rows
        const rows = orders.map(order => [
            order.orderId,
            order.userId,
            order.orderDate.toISOString().split('T')[0],
            order.orderStatus,
            order.paymentInfo.paymentStatus,
            order.paymentInfo.method,
            order.shippingAddress.fullName,
            order.shippingAddress.phone,
            order.items.length,
            order.orderSummary.subtotal,
            order.orderSummary.tax,
            order.orderSummary.deliveryFee,
            order.orderSummary.discountAmount,
            order.orderSummary.total
        ]);
        
        // Combine headers and rows
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        // Set CSV response headers
        const filename = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        return res.status(200).send(csvContent);
    } catch (error) {
        next(error);
    }
};