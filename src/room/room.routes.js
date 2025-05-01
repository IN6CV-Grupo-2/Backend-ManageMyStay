import { Router } from "express";
import { check } from "express-validator";
import { addRoom, getRoomsAvailable, updateRoom, deleteRoom } from "./room.controller.js";
import { validateAddRoom, validateUpdateRoom, validateDeleteRoom } from "../middlewares/validate-room.js";
import { haveRol } from '../middlewares/validate-role.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateFields } from '../middlewares/validate-fields.js'


const router = Router();

router.post(
    "/",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check('number','The number of the room is required').notEmpty(),
        check('type', 'The type of the room is required').notEmpty(),
        check('ability', 'The ability of the room is required').notEmpty(),
        check('priceNight', 'The price per night is required').notEmpty(),
        check('hotel', 'Hotel ID is required').notEmpty().isMongoId(),
        validateFields,
        validateAddRoom,
    ],
    addRoom
)

router.get(
    "/:id",
    [
        check('id', 'Hotel ID is invalid').isMongoId()
    ],
    getRoomsAvailable
)

router.put(
    "/updateRoom/:id",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("id","Room ID is invalid").isMongoId(),
        validateUpdateRoom,
        validateFields
    ],
    updateRoom
)

router.delete(
    "/:id",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("id","id is not valid").isMongoId(),
        validateDeleteRoom
    ],
    deleteRoom
)

export default router;