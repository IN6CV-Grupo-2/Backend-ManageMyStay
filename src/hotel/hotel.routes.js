import { Router } from 'express';
import { createHotel, getHotels, getHotelById, updateHotel, deleteHotel } from '../hotel/hotel.controller.js';
import { validateHotel, validateEditHotel, validateDeleteHotel } from '../middlewares/hotel.validator.js';
import { validateRole } from "../middlewares/validate-role.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

// Route to create a hotel
router.post('/',
    [
        validateJWT,
        validateRole('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'),
        validateHotel
    ], createHotel
);

// Route to update a hotel
router.put('/:id',
    [
        validateJWT, 
        validateRole('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'), 
        validateEditHotel
    ], updateHotel
);

// Route to delete a hotel
router.delete('/:id',
    [
        validateJWT, 
        validateRole('ADMIN_ROLE', 'ADMIN_HOTEL_ROLE'), 
        validateDeleteHotel
    ], deleteHotel
);

// Route to get all hotels
router.get('/',[
    validateJWT
    ] , getHotels
);

// Route to get a hotel by ID
router.get('/:id',
    [
        validateJWT
    ], getHotelById

);

export default router;
