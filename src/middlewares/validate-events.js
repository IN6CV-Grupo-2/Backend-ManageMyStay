import Event from '../event/event.model.js';
import Hotel from '../hotel/hotel.model.js';

export const validateEventsHotel = async (req, res, next) => {
  try {
    const user = req.user;

    const hotel = await Hotel.findOne({adminHotel: user._id});

    if(!hotel){
      return res.status(404).json({
        success: false,
        msg: 'Hotel not found'
      })
    }

    req.hotel = hotel;
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Only a user with admin role can see the events'
    })
  }
}

export const validateCreateEvent = async (req, res, next) => {
  try {
    const hotelId = req.body.hotel || req.body.hotelId;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        msg: 'Hotel not found or not exists'
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: 'Error validating Event creation'
    });
  }
}

export const validateUpdateEvent = async (req, res, next) => {
  try {
    const user = req.user;
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    const {hotelId} = req.body;

    if(!event){
      return res.status(404).json({
        msg: 'Event not found or not exists'
      })
    }

    const hotel = event.hotel;
    if(!user.role !== "ADMIN_ROLE" || user._id.toString() !== hotel.adminUser._id.toString()){
      return res.status(404).json({
        msg: 'Only an administrator or an administrator of the hotel can edit the event'
      })
    }

    const newHotel = await Hotel.findById(hotelId);
    if(!newHotel){
      return res.status(404).json({
        msg: 'Hotel not found'
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: 'Error to validate updating event'
    })
  }
}

export const validateCancelEvent = async (req, res, next) => {
  try {
    const user = req.user;
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if(!event){
      return res.status(404).json({
        msg: 'Event not found'
      })
    }

    next();

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      sucess: false,
      msg: 'Error to validate cancel the event'
    })
  }
}