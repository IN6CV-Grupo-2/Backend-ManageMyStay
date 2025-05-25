import { Router } from 'express';
import { check } from 'express-validator';
import {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} from './hotel.controller.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateUpdateHotel, validateDeleteHotel } from '../middlewares/validate-hotel.js';
import { haveRol } from '../middlewares/validate-role.js';

const router = Router();

router.get("/", getHotels);

router.get('/:id',getHotelById);

router.post(
    "/",
    [
        //validateJWT,
        //haveRol("ADMIN_ROLE"),
        check('name', 'Name is required').notEmpty(),
        check('address', 'Address is required').notEmpty(),
        check('starts', 'Number of starts is required').notEmpty(),
        check('amenities', 'Amenities is required').notEmpty(),
        //validateFields
    ],
    createHotel
);


router.put(
    "/:id",
    [
        //validateJWT,
        //haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check('id', 'Hotel ID is invalid').isMongoId(),
        //validateUpdateHotel,
        validateFields
    ],
    updateHotel
);


router.delete(
    "/:id",
    [
        //validateJWT,
        check('id', 'Hotel ID is invalid').isMongoId(),
        //validateDeleteHotel
    ],
    deleteHotel
);


export default router;
