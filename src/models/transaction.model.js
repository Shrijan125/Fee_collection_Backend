import mongoose,{ Schema} from "mongoose";

const transactionSchema=new Schema({
    amount:{
        type:String,
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student',
        required:true
    },
},{
    timestamps:true
});

export const Transaction=mongoose.model('Transaction',transactionSchema);