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
    
}