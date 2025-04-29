import Reservation from './reservation.model.js';

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

        const newReservation = Reservation.create({
            checkIn,
            checkOut,
            guest,
            rooms,
            hotel
        })

        res.status(200).json(newReservation)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error createing reservation')
    }
}

export const getReservationByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const reservations = await Reservation.find({ rooms: roomId, status: true});

        res.status(200).json({
            checkIn: reservations.checkIn,
            checkOut: reservations.checkOut,
            guest: reservations.guest,
            hotel: reservations.hotel
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json('Error to get reservation by room')
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