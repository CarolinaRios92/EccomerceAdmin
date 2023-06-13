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
                        <th>Pago</th>
                        <th>Comprador</th>
                        <th>Productos</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>
                                {(new Date(order.createdAt)).toLocaleString()}
                            </td>
                            <td className={order.paid ? "text-green-600" : "text-red-600"}>
                                {order.paid ? "SI" : "NO"}
                            </td>
                            <td>
                                Nombre: {order.name}<br />
                                Email: {order.email}<br />
                                Telefono: {order.phone}
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