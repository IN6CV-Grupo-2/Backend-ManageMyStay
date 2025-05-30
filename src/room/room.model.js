import { Schema, model } from 'mongoose';

const roomSchema = new Schema(
    {
        number: {
            type: String,
            required: [true, "The room number is required"]
        },
        type: {
            type: String,
            required: true
        },
        ability: {
            type: String,
            required: true
        },
        priceNight: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        hotel:{
            type: Schema.Types.ObjectId,
            ref: "Hotel",
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

roomSchema.methods.toJSON = function () {
    const { __v, ...room } = this.toObject();
    return room;
}

export default model('Room', roomSchema);