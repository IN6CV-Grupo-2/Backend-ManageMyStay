import { Router } from "express";
import { check } from "express-validator";
import { addRoom, getRoomsAvailable, updateRoom, deleteRoom } from "./room.controller";
import { validarCampos } from "../middlewares/validar-campos";
import { validateAddRoom, validateUpdateRoom, validateDeleteRoom } from "../middlewares/validar-room";

const router = Router();

router.post(
    "/",
    [
        validateAddRoom,
        validarCampos
    ],
    addRoom
)

router.get(
    "/",
    [
        validarCampos
    ],
    getRoomsAvailable
)

router.put(
    "/updateRoom/:id",
    [
        check("id","id id not valid").isMongoId(),
        validateUpdateRoom,
        validarCampos
    ],
    updateRoom
)

router.delete(
    "/:id",
    [
        check("id","id is not valid").isMongoId(),
        validateDeleteRoom
    ],
    deleteRoom
)

export default router;