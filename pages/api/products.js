import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function products(req, res){
    const {method} = req;
    await mongooseConnect();

    if(method === "GET"){
        if(req.query?.id){
            const product = await Product.findOne({_id: req.query.id});
            res.json(product);
        } else {
            res.json(await Product.find());
        }
        
    }

    if(method === "POST"){
        const {title, description, price, images} = req.body;
        const productDoc = await Product.create({
            title,
            description,
            price,
            images,
        })
        res.json(productDoc);
    }

    if(method === "PUT"){
        const {title, description, price, images, _id} = req.body;
        await Product.updateOne({_id}, {title, description, price, images});
        res.json(true);
    }

    if(method === "DELETE"){
        if(req.query?.id){
            await Product.deleteOne({_id: req.query?.id});
            res.json(true)
        }
    }
}