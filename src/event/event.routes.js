import { Router } from "express";
import { check } from "express-validator";
import { getEventsByHotel, getEventById, updateEvent, createEvent, cancelEvent, verifyEventAvailable } from "./event.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { haveRol } from "../middlewares/validate-role.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateUpdateEvent, validateCancelEvent, validateCreateEvent, validateEventsHotel } from '../middlewares/validate-events.js';

const router = Router();

router.get(
    "/",
    [
        validateJWT,
        validateEventsHotel
    ],
    getEventsByHotel
);

router.get(
    "/findEvent/:id",
    [
        check('id', 'Event ID is invalid').isMongoId(),
    ],
    getEventById
);

router.post(
    "/createEvent",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("name", "Name is required").notEmpty(),
        check("description", "Description is required").notEmpty(),
        check("startDate", "Start date is required").notEmpty().isISO8601(),
        check("finishDate", "Finish date is required").notEmpty().isISO8601(),
        check("hotel", "Hotel ID is required").notEmpty().isMongoId(),
        validateCreateEvent,
        validateFields
    ],
    createEvent
);

router.put(
    "/:id",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check('id', 'Event ID is invalid').isMongoId(),
        validateUpdateEvent,
        validateFields
    ],
    updateEvent
);

router.delete(
    "/deleteEvent/:id",
    [
        validateJWT,
        haveRol('ADMIN_ROLE'),
        check("id", "Event ID is invalid").notEmpty(),
        check("id", "ID must be a valid id").isMongoId(),
        validateCancelEvent
    ],
    cancelEvent
);

export default router;