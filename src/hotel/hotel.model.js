import mongoose from 'mongoose';

const HotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  address: {
    type: String,
    required: [true, 'Addess is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  amenities: {
    type: String,
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
  },
  status: {
    type: Boolean,
    default: "true"
  }
});

HotelSchema.methods.toJSON = function() {
  const { __v, _id, ...hotel } = this.toObject();
  hotel.uid = _id;
  return hotel;
};

export default mongoose.model('Hotel', HotelSchema);
