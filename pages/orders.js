import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderPage(){
    const [orders, setOrders] = useState([]);

    useEffect(() =>{
        axios.get("api/orders").then(response => {
            setOrders(response.data);
        })
    },[])

    return (
        <Layout>
            <h1>Ordenes</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Comprador</th>
                        <th>Productos</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>
                                {order.createdAt?.slice(0,10).replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1')} - {order.createdAt?.slice(11,16)}
                            </td>
                            <td>
                                Nombre: {order.name}<br />
                                Email: {order.email}
                            </td>
                            <td>
                                {order.line_items.map(product => (
                                    <>
                                        {product.title} x {product.quantity}<br />
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}