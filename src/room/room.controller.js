import Room from "./room.model.js";
import Hotel from '../hotel/hotel.model.js';

export const addRoom = async (req, res) => {
    try {
        const data = req.body;

        const room = await Room.create({
            number: data.number,
            type: data.type,
            ability: data.ability,
            priceNight: data.priceNight,
            hotel: data.hotel
        })

        await Hotel.findByIdAndUpdate(hotel._id,{
            $push: { rooms: room._id}
        })

        res.status(201).json({
            success: true,
            msg: "Room added",  
            room 
        });
    }catch (error) {
        res.status(400).json({ 
            success: false,
            msg: "Error adding room", 
            error 
        });
    }
};

export const getRoomsAvailable = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const rooms = await Room.find({ 
            status: true,
            hotel: hotelId
        }).populate('hotel', 'name address');

        res.status(200).json({ 
            success: true,
            rooms 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            msg: "Error getting available rooms for hotel", 
            error 
        });
    }
};
  
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
  
        res.status(200).json({ 
            success: true,
            msg: "Updated room", 
            room: updatedRoom 
        });

    }catch (error) {
        res.status(400).json({ 
            success: false,
            msg: "Error updating room", 
            error 
        });
    }
};
  
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndUpdate(id, { status: false }, { new: true });

        await Hotel.findByIdAndUpdate(room.hotel._id, {
            $pull: {rooms: room._id}
        })

        res.status(200).json({ 
            success: true,
            msg: "Removed room", 
            room 
        });
    }catch (error) {
        res.status(500).json({ 
            success: false,
            msg: "Error when deleting room", 
            error 
        });
    }
};