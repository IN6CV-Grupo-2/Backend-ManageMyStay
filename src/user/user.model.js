import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "The name is required"],
            maxLength: 40
        },
        surname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, "The password is required"],
            minLength: 6
        },
        role: {
            type: String,
            required: true,
            enum: ["ADMIN_ROLE", "CLIENT_ROLE", "ADMIN_HOTEL_ROLE"] ,
            default: "CLIENT_ROLE"
        },
        history: [{
            type: Schema.Types.ObjectId,
            ref: "Reservation"
        }],
        status: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('User', userSchema);