import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
    title: {type:String, require: true},
    description: String,
    price: {type:Number, require: true},
});

export const Product = model("Product", ProductSchema);