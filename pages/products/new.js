import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";

export default function NewProduct () {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    async function createProduct(e){
        e.preventDefault();
        const data = {title, description, price};
        await axios.post("/api/products", data)
    }

    return (
        <Layout>
            <h1>New Product</h1>

            <form onSubmit = {createProduct}>

                <label>Product name</label>
                <input 
                    type="text" 
                    placeholder="Product name" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}/>

                <label>Description</label>
                <textarea 
                    value={description} 
                    placeholder="Description" 
                    onChange={e => setDescription(e.target.value)}></textarea>

                <label>Price</label>
                <input 
                    type="number" 
                    placeholder="Price" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)}/>

                <button type="submit" className="btn-primary">Save</button>
            </form>
        </Layout>
    )
}