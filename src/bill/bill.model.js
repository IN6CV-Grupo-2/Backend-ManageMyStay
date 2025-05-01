import mongoose from 'mongoose';

const BillSchema = mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
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

BillSchema.methods.toJSON = function () {
  const { __v, _id, ...bill } = this.toObject();
  bill.uid = _id;
  return bill;
};

export default mongoose.model('Bill', BillSchema);