import { Router } from "express";
import { check } from "express-validator";
import { updateUser, deleteUser, updatedPassword } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js"
import { validateUserDelete, validatePasswordUpdate } from "../middlewares/validar-user.js";

const router = Router();

router.put(
    "/updatePassword/:id",
    [
        check("id", "ID is not valid").isMongoId(),
        validatePasswordUpdate,
        validarCampos
    ],
    updatedPassword
)

router.put(
    "/:id",
    [
        check("id", "id is invalid").isMongoId(),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        check("id", "id is invalid").isMongoId(),
        validateUserDelete
    ],
    deleteUser
)

export default router;
