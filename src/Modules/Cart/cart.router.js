import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as cartController from './controller/cart.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './cart.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./cart.endpoint.js";


const router = Router();

router.post('/' ,auth(endpoint.create),validation(validators.createCart) , asyncHandler(cartController.createCart));
router.patch('/deleteItem',auth(endpoint.create),validation(validators.deleteMeal) , asyncHandler(cartController.deleteMeal));
router.patch('/clearCart',auth(endpoint.create), validation(validators.clearCart), asyncHandler(cartController.clearCart));
router.get('/' ,auth(endpoint.create),validation(validators.getCart), asyncHandler(cartController.getCart));

export default router;