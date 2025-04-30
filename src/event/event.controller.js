import { response, request } from "express";
import Event from "../event/event.model.js";
import Hotel from "../hotel/hotel.model.js";

export const getEventsByHotel = async (req = request, res = response) => {
    try{
        const { hotelId } = req.hotel._id;
        const { page = 1, limit = 10 } = req.query;
        const query = { 
            hotel: hotelId,
            status: true
        
        };
        const events = await Event.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        
        const eventsWithHotel = await Promise.all(events.map(async (event) => {
            const hotel = await Hotel.findById(event.hotel);
            return { ...event.toObject(), hotel };
        }));

        const total = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            events: eventsWithHotel,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching events",
            error: error.message,
        })
    }
}

export const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id)

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        const hotel = await Hotel.findById(event.hotel);

        res.status(200).json({
            success: true,
            event: { ...event.toObject(), hotel }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching event",
            error: error.message,
        })
    }
}

export const createEvent = async (req, res) => {    
    const { name, description, startDate, finishDate, hotel } = req.body;

    try {
        const newEvent = new Event.create({
            name,
            description,
            startDate,
            finishDate,
            additionalServices,
            hotel
        });

        await Hotel.findByIdAndUpdate(hotel._id, {
            $push: { events: newEvent._id}
        })

        res.status(201).json({
            message: "Event created successfully",
            success: true,
            event: newEvent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating event",
            error: error.message,
        })
    }
}

export const updateEvent = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;
        const event = await Event.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            message: "Event updated successfully",
            success: true,
            event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating event",
            error: error.message,
        })
    }
}

export const cancelEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndUpdate(id, { status: false }, { new: true });

        await Hotel.findByIdAndUpdate(event.hotel._id, {
            $pull: {events: event._id}
        })

        res.status(200).json({
            message: "Event deleted successfully",
            success: true,
            event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting event",
            error: error.message,
        })
    }
}

export const verifyEventAvailable = async( req, res) => {
    try {
        const { hotelId } = req.params;
        const hotel = await Hotel.findById(hotelId);
        const currentDate = new Date();
        
        await Promise.all(
            hotel.events.map(async (event) => {
                if(event.finishDate < currentDate) {
                    await Event.findByIdAndUpdate(event._id, {status: false})
                }
            })
        )

        res.status(200).json({
            success: true,
            msg: 'Events verifed successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: 'Error to verify the dates of the event'
        })
    }
}