import Reservation from '../reservations/reservation.model.js';
import Hotel from '../hotel/hotel.model.js';

export const validateReservationsHotel = async (req, res, next) => {
    try {
        const user = req.user;
        
        if(user.role !== "ADMIN_ROLE" || user.role !== "ADMIN_HOTEL_ROLE"){
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

export const validateUpdateReservation = async (req, res, next) => {
    try {
        const user = req.user;
        const { reservationId } = req.params;
        const reservation = await Reservation.findById(reservationId);

        if(!reservation){
            return res.status(404).json({
                msg: 'Reservation not found'
            })
        }

        if(user.role !== "ADMIN_HOTEL_ROLE" || user._id.toString() !== reservation.guest._id.toString() || user.role !== "ADMIN_ROLE"){
            return res.status(404).json({
                msg: 'Only the reservation user or an administrator can edit the reservation'
            })
        }

        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            sucess: false,
            msg: 'Error to update Reservation'
        })
    }
}

export const validateCancelReservation = async (req, res, next) => {
    try {
        const user = req.user;
        const { reservationId } = req.params;
        const reservation = await Reservation.findById(reservationId);

        if(!reservation){
            return res.status(404).json({
                msg: 'Reservation not found'
            })
        }

        if(!user.role !== 'ADMIN_HOTEL_ROLE' || user._id.toString() !== reservation.guest._id.toString() || user.role !== "ADMIN_ROLE"){
            return res.status(404).json({
                msg: 'Only the reservation user or an administrator can cancel the reservation'
            })
        }

        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error to cancel Reservation'
        })
    }
}