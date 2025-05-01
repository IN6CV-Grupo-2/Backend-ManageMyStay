import User from "../users/user.model.js"
import { hash } from "argon2";
import { generarJWT } from "../helpers/generate-jwt.js"

export const login = async (req, res) => {

    try {

        const user = req.user;
        const token = await generarJWT( user.id );
        return res.status(200).json({
            msg: 'Successful login',
            userDetails: {
                token: token
            }
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const register = async (req, res) => {
    try {
        const data = req.body;
        const encryptedPassword = await hash (data.password);
        const user = await User.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: encryptedPassword,
        })

        return res.status(200).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        })
    }
}