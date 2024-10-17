import mongoose, { Schema } from "mongoose";

 const tappingData = new Schema({

    tapper:{
        type:Schema.Types.ObjectId,
        ref:"Tappers"
    },
    supplier:{
        type:Schema.Types.ObjectId,
        ref:"Suppliers"
    },
     count: {
      type: Number,
    },

    completed :{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
)

export const tappingAct =  mongoose.model("TappingData",tappingData)