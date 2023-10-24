import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as mealController from './Controller/Meal.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Meal.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./Meal.endpoint.js";
import reviewRouter from '../Review/review.router.js';


const router = Router({mergeParams:true});

router.use('/:mealId/review', reviewRouter);
router.post('/',auth(endpoint.create) ,fileUpload(fileValidation.image).single('image'), validation(validators.createMeal),asyncHandler(mealController.createMeal));
router.put('/update/:mealId',auth(endpoint.update) ,fileUpload(fileValidation.image).single('image'),validation(validators.updateMeal),asyncHandler(mealController.updateMeal));
router.patch('/softDelete/:mealId',auth(endpoint.softDelete),validation(validators.softDelete),asyncHandler(mealController.softDelete));
router.get('/getSoftDelete',auth(endpoint.get),validation(validators.getSoftDelete),asyncHandler(mealController.getSoftDelete));
router.patch('/restore/:mealId',auth(endpoint.restore),validation(validators.restore),asyncHandler(mealController.restore));
router.delete('/forceDelete/:mealId',auth(endpoint.forceDelete),validation(validators.forceDelete),asyncHandler(mealController.forceDelete));
router.get('/one/:mealId',validation(validators.getMeal), asyncHandler(mealController.getMeal));
router.get('/all',validation(validators.getMeals), asyncHandler(mealController.getMeals));




export default router;