import Hotel from '../models/hotel.model.js';
import Event from '../models/event.model.js';
import Room from '../models/room.model.js';


export const validateUpdateHotel = async (req, res, next) => {
  try {
      const  user = req.user;
      const { hotelId } = req.params;
      const hotel = await Hotel.findById(hotelId);
      const data = req.body

      if(!hotel){
        return res.status(404).json({
          msg: 'Hotel not found'
        })
      }

      const adminUser = hotel.adminUser;
      if(!user.role !== "ADMIN_ROLE" || user._id.toString() !== adminUser._id.toString()){
        return res.status(404).json({
          msg: 'Only an administrator or an administrator of the hotel can edit the hotel'
        })
      }

      if(Array.isArray(data.events)){
        for(const event of data.events) {
          const existsEvent = await Event.findById(event._id);
          if(!existsEvent){
            return res.status(404).json({
              msg: 'One or more events not found'
            })
          }
        }
      }

      if(Array.isArray(data.rooms)){
        for(const room of data.rooms){
          const existsRoom = await Room.findById(room._id);
          if(!existsRoom){
            return res.status(404).json({
               msg: 'Oner or more rooms not found'
            })
          }
        }
      }

      next();
      
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: 'Error to validate the updating the hotel'
    })
  }
}

export const validateDeleteHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findById(hotelId);

    if(!hotel){
      return res.status(404).json({
        msg: 'Hotel not found'
      })
    }

    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: 'Error to validate the deleting hotel'
    })
  }
}