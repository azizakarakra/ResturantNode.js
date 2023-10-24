import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as reviewController from './controller/review.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './review.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./review.endpoint.js";


const router = Router({mergeParams:true});
router.post('/', auth(endpoint.create),validation(validators.createReview), asyncHandler(reviewController.createReview));
router.put('/updateReview/:reviewId', auth(endpoint.update),validation(validators.updateReview), asyncHandler(reviewController.updateReview));
export default router;