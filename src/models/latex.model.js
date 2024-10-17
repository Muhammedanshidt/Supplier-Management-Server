import mongoose, { Schema } from "mongoose";

const letex_schema = new Schema({
    owner: {
        type:Schema.Types.ObjectId,
        ref: "Suppliers"       
    },
    supplierName: String,
    supplierCode:String,
    total_weight: Number,
    jars: Number,
    small_jar:Number,
    big_jar:Number,
    jars_weight: Number,
    latex_weight: Number,
    date:Date,
    film_weight: Number, 
    drc_percentage: Number,
    drc_quantity: Number,
    
    daily_rate:{
        type:Schema.Types.ObjectId,
        ref:"Admin"
    }
},
    { timestamps: true }
)
export const latex = mongoose.model("Latex",letex_schema)

