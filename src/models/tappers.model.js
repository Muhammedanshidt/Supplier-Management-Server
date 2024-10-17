import mongoose, { Schema } from "mongoose";

const tappers_schema = new Schema(
    {
        name: { type: String, },

        phone: { type: Number, },

        place: { type: String, },

        username: { type: String, },

        password: { type: String, },

        rating: { type: Number },


        refresh_token: { type: String },

        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Suppliers",
        },

        drivers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Drivers"
            }
        ],
        latex: [
            {
                type: Schema.Types.ObjectId,
                ref: "Latex"
            }
        ],
        tappingData: [
            {
                type: Schema.Types.ObjectId,
                ref: "TappingData"
            }
        ]


    },
    { timestamps: true }

)

export const tappers = mongoose.model("Tappers", tappers_schema)