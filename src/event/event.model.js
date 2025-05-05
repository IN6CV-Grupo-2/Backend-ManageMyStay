import { schema, model } from "mongoose";

const eventSchema = new schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required']
    },
    finishDate: {
        type: Date,
        required: [true, 'Finish Date is required']
    },
    additionalServices: [{
        type: String,
     }],
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