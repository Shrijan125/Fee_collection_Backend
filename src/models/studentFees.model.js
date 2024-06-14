import mongoose,{Schema} from "mongoose";

const studentFeesSchema=new Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    dues:{
        type:['Boolean'],
        default:[true,true,true,true,true,true,true,true,true,true,true,true]
    }
});

export const StudentFee = mongoose.model('StudentFee',studentFeesSchema);
