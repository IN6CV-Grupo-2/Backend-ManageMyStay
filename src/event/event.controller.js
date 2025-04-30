import { response, request } from "express";
import Event from "../event/event.model.js";
import Hotel from "../hotel/hotel.model.js";

export const getEvents = async (req = request, res = response) => {
    const { page = 1, limit = 10 } = req.query;
    const query = { status: true};

    try{
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
    
    const { name, description, startDate, finishDate, additionalServices, hotel } = req.body;

    try {
        const newEvent = new Event({
            name,
            description,
            startDate,
            finishDate,
            additionalServices,
            hotel
        });

        await newEvent.save();

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
    const { id } = req.params;
    const { _id, ...data } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(id, data, { new: true });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

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

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

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