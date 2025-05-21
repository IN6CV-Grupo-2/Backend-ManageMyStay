<<<<<<< HEAD
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
=======
import mongoose from 'mongoose';

const BillSchema = mongoose.Schema({
  emitionDate: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String,
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: "true"
  }
});

BillSchema.methods.toJSON = function () {
  const { __v, _id, ...bill } = this.toObject();
  bill.uid = _id;
  return bill;
};

export default mongoose.model('Bill', BillSchema);
>>>>>>> 46266e33ef85ea5bb587e0c5b9246e466d4cdf91
