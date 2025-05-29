import {Schema, model} from 'mongoose';

const BillSchema = Schema({
  emitionDate: {
    type: Date,
    default: Date.now
  },
  costumer:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: {
    type: String,
    required: true
  },
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true
    }
  ],
  total: {
    type: Number,
    default: 0.00
  },
  status: {
    type: Boolean,
    default: true
  }
});

export default model('Bill', BillSchema);