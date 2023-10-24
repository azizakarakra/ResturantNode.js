import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createCart = joi
  .object({
    qty: joi.number().min(1),
    mealId: generalFeilds.id.required(),
  })
  .required();

export const deleteMeal = joi
  .object({
    mealIds: generalFeilds.id,
  })
  .required();

export const clearCart = joi.object({}).required();

export const getCart = joi.object({}).required();
