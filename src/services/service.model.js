import { Schema, model } from "mongoose";

const ServiceSchema = Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true 
    },
})

ServiceSchema.methods.toJSON = function () {
    const { __v, _id, ...service } = this.toObject();
    service.uid = _id;
    return service;
}

export default model('Service', ServiceSchema);

