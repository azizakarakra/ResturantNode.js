import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createResturant = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    file: generalFeilds.file.required(),
    phoneNumber: joi.string().required(),
  })
  .required();

export const updateResturant = joi
  .object({
    resturantId: generalFeilds.id,
    name: joi.string().min(2).max(20),
    file: generalFeilds.file,
  })
  .required();

export const getSpecificResturant = joi
  .object({
    resturantId: generalFeilds.id,
  })
  .required();

export const getResturants = joi.object({}).required();
