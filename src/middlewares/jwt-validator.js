import jwt from 'jsonwebtoken';

import user from '../user/user.model.js';

export const JWTValidator = async (req, res, next) => {

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "Token is required"
        })
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await user.findById(uid);

        if(!user){
            return res.status(401).json({
                msg: 'The user does not exist'
            })
        }

        if(!user.status){
            return res.status(401).json({
                msg: 'User with false status'
            })
        }

        req.user = user;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Invalid token"
        })
    }
}