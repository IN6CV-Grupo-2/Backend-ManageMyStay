import {Router} from 'express';
import { check } from 'express-validator';
import { 
 getReservationByHotel,
 createReservation,
 updateReservation,
 cancelReservation
 } from './reservation.controller';
import { validateFields } from '../middlewares/validarte-fields';
import { validateJWT } from '../middlewares/validate-jwt';
import { validateReservationsHotel, createReservation, validateUpdateReservation, validateCancelReservation } from '../middlewares/validate-reservation';

const router = Router();

router.get(
    "/",
    [
        validateJWT,
        validateReservationsHotel,
    ],
    getReservationByHotel
)

router.post(
    "/",
    [
        validateJWT,
        check('checkIn', 'Check-in date is required').notEmpty().isISO8601(),
        check('checkOut', 'check-out date is required').notEmpty().isISO8601(),
        check('rooms', 'Rooms must be an array of room ID"s'),isArray({min: 1}),
        check('hotel','Hotel ID is required').notEmpty().isMongoId(),
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