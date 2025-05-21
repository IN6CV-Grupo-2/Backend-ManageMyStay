<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';

export const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'There is no token in the request'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);

        if(!user){
            return res.status(401).json({
                msg: 'User not exists in the database'
            })
        }

        if(!user.status){
            return res.status(402).json({
                msg: 'Token is invalid : User disabled'
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Token is invalid'
        })
    }
=======
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js';

export const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'There is no token in the request'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'User not exists in the database'
            })
        }

        if(!user.status){
            return res.status(402).json({
                msg: 'Token is invalid : User disabled'
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Token is invalid'
        })
    }
>>>>>>> 46266e33ef85ea5bb587e0c5b9246e466d4cdf91
}