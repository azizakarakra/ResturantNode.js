import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as orderController from './controller/order.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './order.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./order.endpoint.js";


const router = Router();

router.post('/', auth(endpoint.create),validation(validators.createOrder), asyncHandler(orderController.createOrder));
router.post('/allMealsFromCart', auth(endpoint.create),validation(validators.createOrderWithAllMealsFromCart), asyncHandler(orderController.createOrderWithAllMealsFromCart));
router.patch('/cancel/:orderId',auth(endpoint.cancel),validation(validators.cancelOrder), asyncHandler(orderController.cancelOrder));
router.patch('/updateOrderStatusFromAdmin/:orderId',auth(endpoint.update),validation(validators.updateOrderStatusFromAdmin), asyncHandler(orderController.updateOrderStatusFromAdmin));

export default router;