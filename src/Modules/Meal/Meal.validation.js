import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createMeal = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    price: joi.number().min(1).required(),
    file: generalFeilds.file,
    resturantId: generalFeilds.id.required(),
    categoryId: generalFeilds.id.required(),
  })
  .required();

export const updateMeal = joi
  .object({
   name: joi.string().min(2).max(20).required(),
   price: joi.number().min(1).required(),
    mealId: generalFeilds.id,
    resturantId: generalFeilds.id.required(),
    categoryId: generalFeilds.id.required(),
   file: generalFeilds.file,
  })
  .required();

export const softDelete = joi
  .object({
    mealId: generalFeilds.id.required(),
  })
  .required();

export const getSoftDelete = joi.object({}).required();

export const restore = joi
  .object({
    mealId: generalFeilds.id.required(),
  })
  .required();

export const forceDelete = joi
  .object({
    mealId: generalFeilds.id.required(),
  })
  .required();

export const getMeal = joi
  .object({
    mealId: generalFeilds.id.required(),
  })
  .required();

export const getMeals = joi
  .object({
    page: joi.number().min(1),
    size: joi.number().min(1),
  })
  .required();
