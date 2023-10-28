import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as CategoryController from './Controller/Category.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Category.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./Category.endpoint.js";

const router = Router({mergeParams: true});

router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),validation(validators.createCategory),asyncHandler(CategoryController.createCategory));
router.put('/update/:categoryId',auth(endpoint.update),fileUpload(fileValidation.image).single('image'),validation(validators.updateCategory),asyncHandler(CategoryController.updateCategory));
router.get('/Specific/:categoryId',validation(validators.getSpecificCattegory),asyncHandler(CategoryController.getSpecificCattegory));
router.get('/' , validation(validators.getCategories), asyncHandler(CategoryController.getCategories) );

export default router;