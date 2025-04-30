import { Router } from 'express';
import { login, register } from './auth.controller.js'
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { validateLoginUser, validateRegisterUser } from '../middlewares/validar-auth.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    validateLoginUser,
    login
);

router.post(
    '/register',
    registerValidator,
    validateRegisterUser,
    register
);

export default router;