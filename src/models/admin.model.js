import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },   
    daily_rate:Number
},

{timestamps:true}
);

export const Admin = mongoose.model('Admin', adminSchema); 