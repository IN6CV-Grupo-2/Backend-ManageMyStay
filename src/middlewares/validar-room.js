import { verify } from "jsonwebtoken";
import User from "../users/user.model.js"
import Room from "../rooms/room.model.js";
  
export const validateAddRoom = async (req, res, next) => {
    try {
        const { user } = req;

        if (!user || !user.status) {
            return res.status(403).json({ 
                success: false,
                msg: "Invalid user" 
            });
        }

        if (!["ADMIN_ROLE", "ADMIN_HOTEL_ROLE"].includes(user.role)) {
            return res.status(403).json({ 
                success: false,
                msg: "You do not have permission to add rooms" 
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false,
            msg: "Invalid petition", 
            error 
        });
    }
};
  
export const validateUpdateRoom = async (req, res, next) => {
    try {
        const { user } = req; 

        if (!user || !user.status) {
            return res.status(403).json({ msg: "Invalid user" });
        }

        if (!["ADMIN_ROLE", "ADMIN_HOTEL_ROLE"].includes(user.role)) {
            return res.status(403).json({ 
                success: false,
                msg: "You don't have permission to update rooms" 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            msg: "Invalid petition", 
            error 
        });
    }
};

export const validateDeleteRoom = async (req, res, next) => {
    try {
        const { id } = req.params;

        const rolesPermitidos = ["ADMIN_ROLE", "ADMIN_HOTEL_ROLE"];
        const esAdmin = rolesPermitidos.includes(req.user.role);
        const esPropietario = req.user._id.toString() === id;

        if (!esPropietario && !esAdmin) {
            return res.status(403).json({
                success: false,
                msg: "You cannot delete another user"
            });
        }
  
        next();
    }catch (error) {
        return res.status(401).json({ 
            success: false,
            msg: "Invalid petition", 
            error 
        });
    }
};