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

BillSchema.methods.toJSON = function () {
  const { __v, _id, ...bill } = this.toObject();
  bill.uid = _id;
  return bill;
};

export default model('Bill', BillSchema);