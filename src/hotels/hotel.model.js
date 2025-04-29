import mongoose from 'mongoose';

const HotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  amenities: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
});

ProductSchema.methods.toJSON = function() {
  const { __v, _id, ...hotel } = this.toObject();
  hotel.uid = _id;
  return hotel;
};

export default mongoose.model('Hotel', HotelSchema);
