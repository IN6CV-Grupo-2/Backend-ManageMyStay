import { Router } from 'express';
import { check } from 'express-validator';
import { createBill, getBills, getBillById, updateBill, deleteBill, createBillFromReservation } from '../bill/bill.controller.js';
import { validateCreateBill, validateDeleteBill, validateUpdateBill } from '../middlewares/validate-bill.js';
import { haveRol } from "../middlewares/validate-role.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from '../middlewares/validate-fields.js';

const router = Router();

router.post('/',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        check('details', 'Details field is required').notEmpty(),
        check('reservations', 'Reservations must be a non-empty array').isArray({ min: 1 }),
        check('reservations.*', 'Each reservation ID must be a valid Mongo ID').isMongoId(),
        validateFields,
        validateCreateBill
    ], createBill
);

router.post('/auto',
    [
        validateJWT,
        haveRol('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        check('reservationId', 'Reservation ID is required').notEmpty(),
        check('reservationId', 'Invalid reservation ID').isMongoId(),
        validateFields
    ],
    createBillFromReservation
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
