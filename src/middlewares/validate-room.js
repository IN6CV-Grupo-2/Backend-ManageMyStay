import Room from '../room/room.model.js';
import Hotel from '../hotel/hotel.model.js';

export const validateAddRoom = async (req, res, next) => {
    try {
        const { hotel } = req.body;
        const hotelDoc = await Hotel.findById(hotel);

        if(!hotelDoc){
            return res.status(404).json({
                msg: 'Hotel not found or not exists'
            })
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
        const user = req.user;
        const { id } = req.params;
        const data = req.body;

        const room = await Room.findById(id).populate('hotel');
        if(!room){
            return res.status(404).json({
                msg: 'Room not found'
            })
        }

        if(data.hotel){
            const hotel = await Hotel.findById(data.hotel);
            if(!hotel){
                return res.status(404).json({
                    msg: 'New Hotel not found'
                })
            }
        }

        const adminUser = room.hotel.adminUser;
        if(user.role !== "ADMIN_ROLE" && user._id.toString() !== adminUser.toString()){
            return res.status(403).json({
                msg: 'Only an administrator or the hotel administrator can edit the room'
            })
        }

        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ 
            msg: "Invalid petition", 
            error 
        });
    }
};


export const validateDeleteRoom = async (req, res, next) => {
    try {
        const { id } = req.params;
        const  room = await Room.findById(id);

        if(!room){
            return res.status(404).json({
                msg: 'Room not found'
            })
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