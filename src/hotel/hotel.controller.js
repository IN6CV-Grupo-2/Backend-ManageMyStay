import Hotel from './hotel.model.js';

export const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ msg: 'Hotel created successfully', hotel });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while creating the hotel' });
  }
};

export const getHotels = async (req, res) => {
  const { name, category, direccion } = req.query;

  const query = {status: true};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (category) query.category = category;
  if (direccion) query.direccion = { $regex: direccion, $options: 'i' };

  try {
    const hotels = await Hotel.find(query)
      .populate('category')
      .populate('user')
      .populate('event')
      .populate('room');

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
  const { id } = req.params;
  try {
    const updated = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: 'Hotel updated successfully', hotel: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while updating the hotel' });
  }
};


export const deleteHotel = async (req, res) => {
  const { id } = req.params;
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return res.status(400).json({
      msg: 'Confirmation required to deactivate hotel. Please add "?confirm=true" to the URL.',
    });
  }

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });

    if (!hotel.status) {
      return res.status(400).json({ msg: 'Hotel is already deactivated' });
    }

    hotel.status = false;
    await hotel.save();

    res.status(200).json({ msg: 'Hotel deactivated successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while deactivating the hotel' });
  }
};
