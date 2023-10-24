import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createReview = joi
  .object({
    comment: joi.string().min(2).max(20).required(),
    rating: joi.number().min(0),
    mealId: generalFeilds.id.required(),
  })
  .required();

export const updateReview = joi
  .object({
    mealId: generalFeilds.id,
    reviewId: generalFeilds.id,
    comment: joi.string().min(2).max(20).required(),
    rating: joi.number().min(0),
    
  })
  .required();
