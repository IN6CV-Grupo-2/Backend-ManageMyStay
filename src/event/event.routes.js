import { Router } from "express";
import { getAllEvents, getEventsByHotel, getEventById, updateEvent, createEvent, cancelEvent, removeServicesFromEvent, addServicesToEvent } from "./event.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { haveRol } from "../middlewares/validate-role.js";
import { validateFields } from "../middlewares/validate-fields.js";

const router = Router();

router.get(
    "/",
    [
        validateJWT,
        validateFields
    ],
    getAllEvents
);

router.post(
    "/",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE", "CLIENT_ROLE"),
        validateFields
    ],
    createEvent
);

router.get(
    "/hotel/:hotelId",
    validateJWT,
    getEventsByHotel
);

router.get(
    "/:id",
    validateJWT,
    getEventById
);

router.put(
    "/:id",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        validateFields
    ],
    updateEvent
);

router.delete(
    "/:id",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        validateFields
    ],
    cancelEvent
);

router.delete(
    "/remove-services/:id",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        validateFields
    ],
    removeServicesFromEvent
);

router.post(
    "/add-services/:id",
    [
        validateJWT,
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        validateFields
    ],
    addServicesToEvent
);


export default router;