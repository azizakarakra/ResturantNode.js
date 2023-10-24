import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';
const router =Router({caseSensitive: true});

router.post('/signup',validation(validators.signupSchema),asyncHandler(AuthController.signup));
router.post('/login',validation(validators.loginSchema),asyncHandler(AuthController.login));
router.get('/confirmEmail/:token',validation(validators.token),asyncHandler(AuthController.confirmEmail));
router.get('/NewconfirmEmail/:token',validation(validators.token),asyncHandler(AuthController.NewconfirmEmail));
router.patch('/sendCode',validation(validators.sendCode), asyncHandler(AuthController.sendCode));
router.patch('/forgotPassword',validation(validators.forgotPassword), asyncHandler(AuthController.forgotPassword));

export default router;