import { Router } from "express";
import { check } from "express-validator";
import { getEvents, getEventById, updateEvent, createEvent, deleteEvent } from "./event.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateEventDates, validateRole, fieldsValidator, validateCancelEvent } from "../middlewares/validate-events.js";

const router = Router();

router.get("/", getEvents);

router.get(
    "/findEvent/:id",
    [
        validateJWT,
    ],
    getEventById
);

router.put(
    "/updateEvent/:id",
    [
        validateJWT,
        validateRole("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("name", "Name is required").notEmpty(),
        check("description", "Description is required").notEmpty(),
        check("startDate", "Start date is required").notEmpty().isISO8601(),
        check("finishDate", "Finish date is required").notEmpty().isISO8601(),
        check("hotel", "Hotel ID is required").notEmpty().isMongoId(),
        validateEventDates,
        fieldsValidator
    ],
    updateEvent
);

router.delete(
    "/deleteEvent/:id",
    [
        validateJWT,
        validateRole("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("id", "Event ID is invalid").notEmpty(),
        check("id", "ID must be a valid id").isMongoId(),
        validateCancelEvent
    ],
    deleteEvent
);

router.post(
    "/createEvent",
    [
        validateJWT,
        validateRole("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("name", "Name is required").notEmpty(),
        check("description", "Description is required").notEmpty(),
        check("startDate", "Start date is required").notEmpty().isISO8601(),
        check("finishDate", "Finish date is required").notEmpty().isISO8601(),
        check("hotel", "Hotel ID is required").notEmpty().isMongoId(),
        validateEventDates,
        fieldsValidator
    ],
    createEvent
);

export default router;