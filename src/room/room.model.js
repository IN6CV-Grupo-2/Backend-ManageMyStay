import { Schema, model } from 'mongoose';

const userSchema = new Schema(
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

userSchema.methods.toJSON = function () {
    const { __v, _id, ...room } = this.toObject();
    return room;
}

export default model('Room', userSchema);