import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createOrder = joi
  .object({
    meals: joi.array().items(
      joi.object({
        mealId: generalFeilds.id.required(),
        qty: joi.number().min(1).required(),
      })
    ),
    address: joi.string().min(3).max(20).required(),
    phoneNumber: joi.string().pattern(/^\d{10}$/),
    paymentType: joi.string().min(2).max(15),
  })
  .required();

export const createOrderWithAllMealsFromCart = joi
  .object({
    address: joi.string().min(3).max(20).required(),
    phoneNumber: joi.string().pattern(/^\d{10}$/),
    paymentType: joi.string().min(2).max(15),
  })
  .required();

export const cancelOrder = joi
  .object({
    orderId: generalFeilds.id.required(),
    resonReject: joi.string().required(),
  })
  .required();

export const updateOrderStatusFromAdmin = joi
  .object({
    orderId: generalFeilds.id.required(),
    status: joi.string().required(),
  })
  .required();
