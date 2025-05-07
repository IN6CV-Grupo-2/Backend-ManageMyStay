import { Router } from "express";
import { check } from "express-validator";
import { getServices, getServiceById, getServiceByName, saveService, updateService, deleteService } from "./service.controller.js";
import { validateFields } from '../middlewares/validate-fields.js';
import { validateJWT } from "../middlewares/validate-jwt.js";
import { haveRol } from "../middlewares/validate-role.js";

const router = Router();

router.get(
    "/",
    [
        validateJWT,
    ],
    getServices
)

router.get(
    "/search/:id",
    [
        validateJWT,
        check("id", "id is invalid").isMongoId(),
        validateFields
    ],
    getServiceById
)

router.get(
    "/name/:name",
    [
        validateJWT,
        check("name", "name is invalid").isString(),
        validateFields
    ],
    getServiceByName
)

router.post(
    "/save/",
    [
        validateJWT,
        check("name", "name is required").not().isEmpty(),
        check("description", "description is required").not().isEmpty(),
        check("price", "price is required").not().isEmpty(),
        haveRol("ADMIN_ROLE", "ADMIN_HOTEL_ROLE"),
        validateFields
    ],
    saveService
)

router.put(
    "/update/:id",
    [
        validateJWT,
        check("id", "id is invalid").isMongoId(),
        validateFields
    ],
    updateService
)

router.delete(
    "/delete/:id",
    [
        validateJWT,
        check("id", "id is invalid").isMongoId(),
        validateFields
    ],
    deleteService
)


export default router;