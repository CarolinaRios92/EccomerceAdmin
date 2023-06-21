import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler (req, res) {
    await mongooseConnect();
    const {orderId} = req.query;

    if(req.method === "GET"){
        const orders = await Order.find().sort({createdAt: -1})
        res.json(orders)
    }

    if(req.method === "PUT"){
        const existingOrder = await Order.findOne({_id: orderId});
        const updateOrder = await Order.findByIdAndUpdate(existingOrder._id, req.body);
        res.json(updateOrder);
    };   
}