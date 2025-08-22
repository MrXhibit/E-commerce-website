import { Router } from "express";
import { getCurentAdmin, adminLogout, getSalesReports, exportSalesReportsCSV } from "@/presentation/controller";
import { authenticateAdmin } from "@/presentation/middleware/auth.middleware";

const adminRouter = Router();

// Apply admin authentication to all routes
adminRouter.use(authenticateAdmin);

// Existing admin routes
adminRouter.get('/logout', adminLogout);
adminRouter.get('/', getCurentAdmin);

// Sales reports routes
adminRouter.get('/sales-reports', getSalesReports);
adminRouter.get('/sales-reports/export', exportSalesReportsCSV);

export default adminRouter;
