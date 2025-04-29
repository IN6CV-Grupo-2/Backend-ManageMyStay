import Reservation from '../reservations/reservation.model.js';
import Room from '../room/room.model.js';
import Hotel from '../hotel/hotel.model.js';

export const validateReservationsHotel = async (req, res, next) => {
    try {
        const user = req.user;
        
        if(user.role !== "ADMIN_ROLE" && user.role !== "ADMIN_HOTEL_ROLE"){
            return res.status(404).json({
                success: false,
                msg:'Only a user with admin role can see the reservations'
            })
        }

        const hotel = await Hotel.findOne({adminHotel: user._id});
        
        if(!hotel){
            return res.status(404).json({
                success: false,
                msg: 'Hotel not found for this admin'
            });
        }

        req.hotel = hotel;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json('Error to validate reservations')
    }
}

export const validateCreateReservation = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error to create the reservation'
        })
    }
}