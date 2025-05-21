<<<<<<< HEAD
import { Router } from 'express';
import { check } from 'express-validator';
import {createBill,getBills,getBillById,updateBill,deleteBill} from '../bill/bill.controller.js';
import {validateCreateBill,validateDeleteBill, validateUpdateBill} from '../middlewares/validate-bill.js';
import { haveRol } from "../middlewares/validate-role.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from '../middlewares/validate-fields.js';

const router = Router();

router.post('/',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        check('details', 'Details field is required').notEmpty(),
        check('reservation', 'Reservation is required').notEmpty(),
        check('reservation', 'Reservation ID is invalid').isMongoId(),
        check('total', 'Total must be a non-negative number').isFloat({ min: 0 }),
        validateFields,
        validateCreateBill
    ], createBill
);

router.get('/', getBills);

router.get('/:id', getBillById);

router.put('/:id',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        validateFields,
        validateUpdateBill
    ], updateBill
);

router.delete('/:id',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        check('id', 'Bill ID is invalid').isMongoId(),
        validateDeleteBill
    ], deleteBill
);

export default router;
=======
import { Router } from 'express';
import {createBill,getBills,getBillById,updateBill,deleteBill} from '../bill/bill.controller.js';
import {validateCreateBill,validateDeleteBill, validateUpdateBill} from '../middlewares/validator-bill.js';
import { haveRol } from "../middlewares/validate-role.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post('/',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        validateCreateBill
    ], createBill
);

router.get('/', getBills);

router.get('/:id', getBillById);

router.put('/:id',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        validateUpdateBill
    ], updateBill
);

router.delete('/:id',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        validateDeleteBill
    ], deleteBill
);

export default router;
>>>>>>> 46266e33ef85ea5bb587e0c5b9246e466d4cdf91
