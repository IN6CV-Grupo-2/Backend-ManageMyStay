import { Router } from "express";
import { check } from "express-validator";
import { getEvents, getEventById, updateEvent, createEvent, deleteEvent } from "./event.controller.js";
import { JWTValidator } from "../middlewares/jwt-validator.js";
import { validateEventDates, validateRole, fieldsValidator } from "../middlewares/events-validator.js";

const router = Router();

router.get("/", getEvents);

router.get(
    "/findEvent/:id",
    [
        JWTValidator,
    ],
    getEventById
);

router.put(
    "/updateEvent/:id",
    [
        JWTValidator,
        validateRole("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("name", "Name is required").notEmpty(),
        check("description", "Description is required").notEmpty(),
        check("startDate", "Start date is required").notEmpty(),
        check("finishDate", "Finish date is required").notEmpty(),
        check("hotel", "Hotel ID is required").notEmpty(),
        check("additionalServices", "Additional services ID is required").notEmpty(),
        validateEventDates,
        fieldsValidator
    ],
    updateEvent
);

router.delete(
    "/deleteEvent/:id",
    [
        JWTValidator,
        validateRole("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("id", "ID is required").notEmpty(),
        check("id", "ID must be a valid id").isMongoId(),
        fieldsValidator
    ],
    deleteEvent
);

router.post(
    "/createEvent",
    [
        JWTValidator,
        validateRole("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        check("name", "Name is required").notEmpty(),
        check("description", "Description is required").notEmpty(),
        check("startDate", "Start date is required").notEmpty(),
        check("finishDate", "Finish date is required").notEmpty(),
        check("hotel", "Hotel ID is required").notEmpty(),
        check("additionalServices", "Additional services ID is required").notEmpty(),
        validateEventDates,
        fieldsValidator
    ],
    createEvent
);

export default router;