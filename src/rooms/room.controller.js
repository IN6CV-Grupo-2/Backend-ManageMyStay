import { response, request } from "express";
import Room from "./room.model.js";

export const addRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();

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
  
        if(!updatedRoom) {
            return res.status(404).json({
                success: false, 
                msg: "Room not found" 
            });
        }
  
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
  
        if(!room) {
            return res.status(404).json({ 
                success: false,
                msg: "Room not found" 
            });
        }
  
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