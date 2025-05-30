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

export const createReservation = async (req, res) => {
    try {
        const guest = req.user;
        const { checkIn, checkOut, room: roomId } = req.body;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ msg: 'Room not found' });
        }

        // Crear la reserva
        const newReservation = await Reservation.create({
            checkIn,
            checkOut,
            guest,
            room: room._id,
            hotel: room.hotel
        });

        // Marcar el cuarto como ocupado
        await Room.findByIdAndUpdate(room._id, { status: false }, { new: true });

        res.status(200).json(newReservation);
    } catch (error) {
        console.error('❌ Error en createReservation:', error);
        return res.status(500).json({
            message: 'Error interno en el servidor',
            error: error.message || error.toString(),
        });
    }
};


export const updateReservation = async(req, res = response) => {
    try {
        const { id } = req.params;
        const {_id, guest, ...data} = req.body;

        const reservation = await Reservation.findByIdAndUpdate(id, data, {new: true});
        
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
        const { id } = req.params;
        const reservation = await Reservation.findByIdAndUpdate(id, { status: false},{new: true});

        await Room.findByIdAndUpdate(reservation.room._id, { status: true }, { new: true });


        return res.status(200).json({
            success: true,
            msg: 'Reservation cancelled successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json('Error to cancel the reservation asdasd')
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

export const getReservationByUser = async (req, res) => {
    try {
        console.log("Se llamó a getReservationByUser con uid:", req.params.id);
        const { id } = req.params; 
        const { limit = 10, since = 0, orderBy = 'checkIn', sort = 'asc' } = req.query;

        const query = {
            guest: id,          
            status: true
        };

        let sortOptions = {};
        if (orderBy === 'checkIn') {
            sortOptions = { checkIn: sort === 'asc' ? 1 : -1 };
        } else if (orderBy === 'checkOut') {
            sortOptions = { checkOut: sort === 'asc' ? 1 : -1 };
        } else {
            sortOptions = { checkIn: 1 };
        }

        const [total, reservations] = await Promise.all([
            Reservation.countDocuments(query),
            Reservation.find(query)
                .skip(Number(since))
                .limit(Number(limit))
                .sort(sortOptions)
                .populate('guest', 'name email')       // opcional: datos del usuario
                .populate('hotel', 'name address')     // opcional: datos del hotel
                .populate('room', 'roomNumber')       // opcional: datos de habitaciones
        ]);

        res.status(200).json({
            total,
            reservations
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error showing user reservations');
    }
};


export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id)
            .populate('guest', 'name email')     
            .populate('room', 'number type')     
            .populate('hotel', 'name location'); 

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reserva no encontrada'
            });
        }

        return res.status(200).json({
            success: true,
            reservation
        });

    } catch (error) {
        console.error("❌ Error al obtener la reserva:", error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener la reserva',
            error: error.message
        });
    }
};