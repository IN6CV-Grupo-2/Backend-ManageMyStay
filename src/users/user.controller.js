import { response } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...data } = req.body;

        if(password){
            data.password = await hash(password);
        }

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
        const autheticatedUser = req.user;

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