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
  starts: {
    type: Number,
    required: [true, 'The number of starts is required']
  },
  amenities: {
    type: String,
    required: true
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


                                                                                        
export default mongoose.model('Hotel', HotelSchema);