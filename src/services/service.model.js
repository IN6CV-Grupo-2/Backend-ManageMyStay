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


export default model('Service', ServiceSchema);

