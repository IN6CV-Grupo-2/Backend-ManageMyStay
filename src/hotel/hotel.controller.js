import Hotel from './hotel.model.js';
import Room from '../room/room.model.js';
import User from '../user/user.model.js';

export const createHotel = async (req, res) => {
  try {
    const { name, address, starts, amenities, price, rating, reviews, image, adminUser } = req.body;

    const hotel = await Hotel.create({
      name,
      address,
      starts,
      amenities,
      price,
      rating,
      reviews,
      image,
      adminUser
    });

    res.status(201).json({ msg: 'Hotel created successfully', hotel });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while creating the hotel' });
  }
};

export const getHotels = async (req, res) => {
  const { name, direccion } = req.query;

  const query = { status: true };
  if (name) query.name = { $regex: name, $options: 'i' };
  if (direccion) query.direccion = { $regex: direccion, $options: 'i' };

  try {
    const hotels = await Hotel.find(query); // Elimina los populate innecesarios
    res.status(200).json(hotels);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while retrieving hotels' });
  }
};

export const getHotelById = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findById(id)
      .populate('category')
      .populate('user')
      .populate('event')
      .populate('room');

    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });

    res.status(200).json(hotel);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while retrieving the hotel' });
  }
};


export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params; // Cambiado de `hotelId` a `id`
    const { _id, ...data } = req.body;

    const hotel = await Hotel.findByIdAndUpdate(id, data, { new: true });

    if (!hotel) {
      return res.status(404).json({ msg: 'Hotel not found' });
    }

    return res.status(200).json({
      name: hotel.name,
      address: hotel.address,
      starts: hotel.starts,
      amenities: hotel.amenities,
      adminUser: hotel.adminUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while updating the hotel' });
  }
};


export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params; // Cambiado de `hotelId` a `id`
    const hotel = await Hotel.findByIdAndUpdate(id, { status: false }, { new: true });

    if (!hotel) {
      return res.status(404).json({ msg: 'Hotel not found' });
    }

    await Promise.all(
      hotel.rooms.map(room =>
        Room.findByIdAndUpdate(room._id, { status: false }, { new: true })
      )
    );

    await User.findByIdAndUpdate(hotel.adminUser._id, { role: "CLIENT_ROLE" }, { new: true });

    res.status(200).json({ msg: 'Hotel deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: 'Error to delete the Hotel'
    });
  }
};
