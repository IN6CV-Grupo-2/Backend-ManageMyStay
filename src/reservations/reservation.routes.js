import {Router} from 'express';
import { check } from 'express-validator';
import { 
 getReservationByHotel,
 createReservation,
 updateReservation,
 cancelReservation,
 getReservationByUser,
 getReservationById
 } from './reservation.controller.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateReservationsHotel, validateUpdateReservation, validateCancelReservation,} from '../middlewares/validate-reservation.js';

const router = Router();

router.get(
    "/",
    [
        validateJWT,
        validateReservationsHotel,
    ],
    getReservationByHotel
)

router.get(
    "/reservationUser/:id",
    [
        validateJWT
    ],
    getReservationByUser
)

router.get(
    "/findReservation/:id",
    [
        validateJWT
    ],
    getReservationById
)
router.post(
    "/",
    [
        validateJWT,
        check('checkIn', 'Check-in date is required').notEmpty().isISO8601(),
        check('checkOut', 'check-out date is required').notEmpty().isISO8601(),
        validateFields
    ],
    createReservation
)

router.put(
    "/:id",
    [
        validateJWT,
        check('id', 'Reservation ID is invalid').isMongoId(),
        validateUpdateReservation,
        validateFields
    ],
    updateReservation
)

router.delete(
    "/:id",
    [
        validateJWT,
        check('id', 'Reservation ID is invalid').isMongoId(),
        validateCancelReservation
    ],
    cancelReservation
)

export default router;