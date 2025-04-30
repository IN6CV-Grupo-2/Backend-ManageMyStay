import { Router } from "express";
import { check } from "express-validator";
import { updateUser, deleteUser, updatedPassword } from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js"
import { validateUserDelete, validatePasswordUpdate, validateUpdateUSer } from "../middlewares/validar-user.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.put(
    "/updatePassword/:id",
    [
        validarJWT,
        check("id", "id is not valid").isMongoId(),
        validatePasswordUpdate,
        validarCampos
    ],
    updatedPassword
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "id is invalid").isMongoId(),
        validateUpdateUSer,
        validarCampos
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "id is invalid").isMongoId(),
        validateUserDelete
    ],
    deleteUser
)

export default router;
