import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createCategory = joi.object({
   resturantId:generalFeilds.id,
   name: joi.string().min(2).max(20).required(),
   file: generalFeilds.file.required(),

}).required();

export const updateCategory = joi.object({
  resturantId:generalFeilds.id,
   categoryId:generalFeilds.id,
   name: joi.string().min(2).max(20),
   file: generalFeilds.file,

   
}).required();

export const getSpecificCattegory = joi.object({
   categoryId:generalFeilds.id,
   resturantId:generalFeilds.id,
}).required();