import mongoose ,{ Schema } from "mongoose";

const adminSchema=Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    adminId:{
        type:String,
        required:true
    }
});

export const Admin=mongoose.model('Admin',adminSchema);