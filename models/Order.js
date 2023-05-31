import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
    line_items: Object,
    name:String,
    email:String,
    paid:Boolean,
},{
    timestamps: true,
});

export const Order = models?.Order || model("Order", OrderSchema);

