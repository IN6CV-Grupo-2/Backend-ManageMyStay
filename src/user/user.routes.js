import { Router } from "express";
import { check } from "express-validator";
import { updateUser, deleteUser, updatedPassword, getUsers } from "./user.controller.js";
import { validateFields } from '../middlewares/validate-fields.js'; 
import { validateUserDelete, validatePasswordUpdate, validateUpdateUSer } from "../middlewares/validate-user.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import User from "./user.model.js"; // Asegúrate de importar el modelo

const router = Router();

router.get(
    "/",
    [
        //validateJWT,
    ],
    getUsers
)

router.get(
    "/:id",
    [
        check("id", "id is invalid").isMongoId(), // Verifica que el ID sea un ObjectId válido
        validateFields,
    ],
    async (req, res) => {
        try {
            const { id } = req.params;
            console.log("ID recibido:", id); // Depuración
            const user = await User.findById(id); // Asegúrate de que `User` esté definido

            if (!user) {
                console.log("Usuario no encontrado"); // Depuración
                return res.status(404).json({
                    success: false,
                    msg: "User not found",
                });
            }

            res.status(200).json({
                success: true,
                msg: "User retrieved successfully",
                user,
            });
        } catch (error) {
            console.error("Error al obtener el usuario:", error); // Depuración
            res.status(500).json({
                success: false,
                msg: "Error retrieving user",
                error: error.message,
            });
        }
    }
);

router.put(
    "/updatePassword/:id",
    [
        //validateJWT,
        check("id", "id is not valid").isMongoId(),
        validatePasswordUpdate,
        validateFields
    ],
    updatedPassword
)

router.put(
    "/:id",
    [
        //validateJWT,
        check("id", "id is invalid").isMongoId(),
        validateUpdateUSer,
        validateFields
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        //validateJWT,
        check("id", "id is invalid").isMongoId(),
        validateUserDelete
    ],
    deleteUser
)

export default router;
