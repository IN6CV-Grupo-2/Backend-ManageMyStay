import { schema, model } from "mongoose";

const eventSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    finishDate: {
        type: Date,
        required: true,
    },
    additionalServices: {
       type: schema.Types.ObjectId,
        ref: "AdditionalServices",
        required: true,
    },
    hotel: {
        type: schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});

eventSchema.methods.toJSON = function(){
    const { __v, _id, ...event} = this.toObject();
    event.uid = _id;
    return event;
}

export default model("Event", eventSchema);