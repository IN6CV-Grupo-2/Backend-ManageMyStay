import { response } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...data } = req.body;
        
        const user = await User.findByIdAndUpdate(id, data, {new: true});
        res.status(200).json({
            success: true,
            msg: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updating user',
            error: error.message
        });
    }
}

export const deleteUser = async (req, res = response) => {
    try {
        
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Deleted User',
            user,
            autheticatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error deleting user",
            error: error.message
        });
        
    }
}

export const updatedPassword = async (req, res = response) => {
    
    try {
        const { id } = req.params;
        const { password } = req.body;

        if(password){
            data.password = await hash(password);
        }

        const updatedUser = await User.findByIdAndUpdate(id, { password }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Password update",
            updatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error to update the password",
            error: error.message
        });
    }

}

export const crateAdmin = async () => {
    try {
        const adminD = await User.findOne({ role: "ADMIN_ROLE" });
        if(!adminD){
            const passwordEncrypted = await hash("Admin123");
            const admin = new User({
                name: "Admin",
                surname: "Administrator",
                email: "admin@gmail.com",
                password: passwordEncrypted,
                role: "ADMIN_ROLE",
            });
            await admin.save();
            console.log("Administrador iniciado");
        } else {
            console.log("Administrador ya activo");
        }
    } catch (error) {
        console.error("Error creando administrador:", error);
    }
};