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
