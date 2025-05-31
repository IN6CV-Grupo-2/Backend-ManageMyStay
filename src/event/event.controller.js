import Event from "../event/event.model.js";
import Hotel from "../hotel/hotel.model.js";

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: true })
            .populate("additionalServices")
            .populate("manager", "name email")
            .populate("hotel", "name address image");
        const total = events.length;
        res.status(200).json({
            success: true,
            total,
            events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching events",
            error: error.message,
        });
    }
};

export const getEventsByHotel = async (req = request, res = response) => {
    try{
        const { hotelId } = req.params;

        const hotel = await Hotel.findById(hotelId).populate('events');
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found",
            });
        }
        const events = hotel.events.filter(event => event.status === true);
        const total = events.length;

        const populatedEvents = await Event.find({ _id: { $in: events.map(event => event._id) } })
            .populate("additionalServices")
            .populate("manager", "name email")
            .populate("hotel", "name address image");


        res.status(200).json({
            success: true,
            total,
            populatedEvents,
            
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
          .populate("additionalServices")
          .populate("manager", "name email");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        const hotel = await Hotel.findById(event.hotel);

        res.status(200).json({
            success: true,
            event,
            hotel
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
    const { name, description, startDate, finishDate, hotel, services = [] } = req.body;

    try {
        const newEvent = new Event({
            name,
            description,
            startDate,
            finishDate,
            additionalServices: services,
            manager: req.user._id,
            hotel,
        });

        await newEvent.save();

        const event = await Event.findById(newEvent._id)
            .populate("additionalServices")
            .populate("manager", "name email")
            .populate("hotel", "name address");

        await Hotel.findByIdAndUpdate(hotel, {
            $push: { events: newEvent._id }
        });

        res.status(201).json({
            message: "Event created successfully",
            success: true,
            event: event,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating event",
            error: error.message,
        });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { services = [] } = req.body;
        const data = req.body;
        
        const originalEvent = await Event.findById(id);
        if (!originalEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        if (data.hotel && data.hotel !== originalEvent.hotel.toString()) {
            const oldHotelId = originalEvent.hotel;
            const newHotelId = data.hotel;

            if (!mongoose.Types.ObjectId.isValid(newHotelId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid new hotel ID",
                });
            }

            await Hotel.findByIdAndUpdate(oldHotelId, {
                $pull: { events: id }
            });

            await Hotel.findByIdAndUpdate(newHotelId, {
                $push: { events: id }
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                ...data,
                additionalServices: services
            },
            { new: true }
        );

        const eventWithDetails = await Event.findById(updatedEvent._id)
            .populate("additionalServices")
            .populate("manager", "name email")
            .populate("hotel", "name address");

        res.status(200).json({
            message: "Event updated successfully",
            success: true,
            event: eventWithDetails,
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

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        await Hotel.findByIdAndUpdate(event.hotel, {
            $pull: { events: event._id }
        });

        res.status(200).json({
            message: "Event canceled successfully",
            success: true,
            event,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error canceling event",
            error: error.message,
        });
    }
};

export const removeServicesFromEvent = async (req, res) => {
    const { id } = req.params; 
    const { services = [] } = req.body; 

    try {
        if (!Array.isArray(services) || services.length === 0) {
            return res.status(400).json({
                success: false,
                message: "You must provide at least one service ID to remove.",
            });
        }


        const event = await Event.findByIdAndUpdate(
            id,
            {
                $pull: {
                    additionalServices: { $in: services }
                }
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Services removed from event",
            event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing services from event",
            error: error.message,
        });
    }
};

export const addServicesToEvent = async (req, res) => {
    const { id } = req.params;
    const { services = [] } = req.body;

    try {
        if (!Array.isArray(services) || services.length === 0) {
            return res.status(400).json({
                success: false,
                message: "You must provide at least one service ID to add.",
            });
        }

        

        const event = await Event.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    additionalServices: { $each: services }
                }
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Services added to event",
            event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding services to event",
            error: error.message,
        });
    }
};

