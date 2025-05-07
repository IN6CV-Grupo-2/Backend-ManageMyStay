import { Schema, model } from "mongoose";

const reservationSchema = Schema({
    checkIn: {
        type: Date,
        required: [true, 'Check-in is required']
    },
    checkOut: {
        type: Date,
        required: [true, 'Check-Out is required']
    },
    guest:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The Guest is required']
    },
    rooms:[{
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required:[true,'Room is required']
    }],
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: [true, 'Hotel is required']
    },
    status: {
        type: Boolean,
        default: true
    }
})

export default model('Reservation', reservationSchema);