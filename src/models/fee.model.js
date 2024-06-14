import mongoose,{Schema} from "mongoose";

const feeSchema=new Schema({
    grade:{
        type: String,
        required: true,
        enum: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']    
    },
    amount:{
        type:String,
        required:true,
        default:'0'
    }
});

const Fee=mongoose.model('Fee',feeSchema);