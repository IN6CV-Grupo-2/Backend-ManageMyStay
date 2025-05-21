<<<<<<< HEAD
export const haveRol = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(500).json({
                success: false,
                msg: 'Is need to verify a role'
            })
        }
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                success: false,
                msg:  `User is not authorized, his role is ${req.user.role}, the roles authorized is ${roles}`
            })
        }
        next();
    }
    
=======
export const haveRol = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(500).json({
                success: false,
                msg: 'Is need to verify a role'
            })
        }
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                success: false,
                msg:  `User is not authorized, his role is ${req.usuario.role}, the roles authorized is ${roles}`
            })
        }
        next();
    }
    
>>>>>>> 46266e33ef85ea5bb587e0c5b9246e466d4cdf91
}