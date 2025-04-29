import { verify, hash } from "jsonwebtoken";
import User from '../users/user.model.js';

export const validatePasswordUpdate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password, oPassword } = req.body;

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            })
        }

        const validPassword = verify(user.password, oPassword);
        if(!validPassword){
            return res.status(404).json({
                success: false,
                msg: "The old password does not match"
            })
        }

        if(password){
            req.body.password = await hash(password, 10);
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error validating password update',
            error: error.message
        })   
    }

}

export const validateUserDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const authenticatedUser = req.user;

        if(authenticatedUser._id.toString() !== id && authenticatedUser.role !== "ADMIN_ROLE" && authenticatedUser.role !== "ADMIN_HOTEL_ROLE"){
            res.status(403).json({
                success: false,
                msg: "Only the user can delete their profile or an administrator"
            });
        }

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        if(!password){
            return res.status(400).json({
                success: false,
                msg: "As a security measure, enter the user`s password to delete it"
            });
        }

        const validPassword = verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                success: false,
                msg: "The password entered is incorrect "
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error during user validation',
            error: error.message
        })
        
    }
}