import mongoose, { Schema } from "mongoose";

const drivers_schema = new Schema(
    {
        name: { type: String, },

        phone: { type: Number, require: [true, "enter mobile number"] },

        location: { type: String, },

        password: { type: String },

        refresh_token: { type: String },

        latex_area: [{ type: String }],

        suppliers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Suppliers"
            }
        ],
        tappers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Tappers"
            }
        ]

    },
    { timestamps: true }

)

export const drivers = mongoose.model("Drivers", drivers_schema)