import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as ResturantController from './controller/resturant.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './resturant.validation.js';
import validation from "../../Middleware/validation.js";
import Category from '../Category/Category.router.js';
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./resturant.endpoin.js";

const router = Router();
router.use('/:resturantId/category', Category);
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validators.createResturant),asyncHandler(ResturantController.createResturant));
router.put('/update/:resturantId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validators.updateResturant),asyncHandler(ResturantController.updateResturant));
router.get('/:resturantId',auth(endpoint.get),validation(validators.getSpecificResturant),asyncHandler(ResturantController.getSpecificResturant));
router.get('/' ,auth(Object.values(roles)),validation(validators.getResturants), asyncHandler(ResturantController.getResturants) );

export default router;