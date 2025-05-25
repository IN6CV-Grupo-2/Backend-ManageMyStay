import mongoose from 'mongoose';

const HotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  starts: {
    type: Number,
    required: [true, 'The number of starts is required'],
    min: 1,
    max: 5
  },
  amenities: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }],
  status: {
    type: Boolean,
    default: true
  }
});

HotelSchema.methods.toJSON = function() {
  const { __v, _id, ...hotel } = this.toObject();
  hotel.uid = _id;
  return hotel;
};

export default mongoose.model('Hotel', HotelSchema);
