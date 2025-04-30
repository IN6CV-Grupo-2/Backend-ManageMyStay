import Reservation from './reservation.model.js';
import Room from '../room/room.model.js';


export const getReservationByHotel = async (req, res) => {
    try {
        const { hotelId } = req.hotel._id 
        const { limit = 10, since = 0, orderBy = 'checkIn', sort = 'asc'} = req.query;
        const query = {
            hotel: hotelId,
            status: true
        };

        let sortOptions = {};
        if(orderBy === 'checkIn') {
            sortOptions = {checkIn: sort === 'asc' ? 1: -1};
        }else if(orderBy === 'checkOut'){
            sortOptions = {checkOut: sort === 'asc' ? 1: -1};
        }else {
            sortOptions = {checkIn: 1};
        }
        
        const [total, reservations ] = await Promise.all([
            Reservation.countDocuments(query),
            Reservation.find(query)
                .skip(Number(since))
                .limit(Number(limit))
                .sort(sortOptions)
        ]);

        res.status(200).json({
            total,
            reservations
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json('Error showing hotel reservations')
    }
}

export const createReservation = async(req, res) => {
    try {
        const guest = req.user;
        const {checkIn, checkOut,rooms, hotel} = req.body;

        const newReservation = await Reservation.create({
            checkIn,
            checkOut,
            guest,
            rooms,
            hotel
        })

        await Promise.all(
            rooms.map(room => 
                Room.findByIdAndUpdate(room._id, { status: false}, {new: true})
            )
        )

        res.status(200).json(newReservation)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error createing reservation')
    }
}

export const updateReservation = async(req, res = response) => {
    try {
        const { reservationId } = req.params;
        const {_id, guest, ...data} = req.body;

        const reservation = await Reservation.findByIdAndUpdate(reservationId, data, {new: true});
        
        return res.status(200).json({
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            guest: reservation.guest,
            rooms: reservation.rooms,
            hotel: reservation.hotel
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json('Error to update the reservation')
    }
}

export const cancelReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        await Reservation.findByIdAndUpdate(reservationId, { status: false},{new: true});

        return res.status(200).json({
            success: true,
            msg: 'Reservation cancelled successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json('Error to cancel the reservation')
    }
}

export const verifyRoomsAvailable = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const reservations = await Reservation.find({hotel: hotelId});
        const currentDate = new Date();

        await Promise.all(
            reservations.map(async (reservation) => {
                if(reservation.checkOut < currentDate) {
                    await Promise.all(
                        reservation.rooms.map(async (room) => {
                            await Room.findByIdAndUpdate(room._id, {status: true}, {new: true})
                        })
                    )
                }
            }
            )
        )

        res.status(200).json({
            msg: 'Rooms verify successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error to verify the rooms'
        })
    }
}