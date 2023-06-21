import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import DeliveredOrder from "@/components/DeliveredOrder";

export default function OrderPage(){
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() =>{
        setIsLoading(true);
        axios.get("api/orders").then(response => {
            setOrders(response.data);
            setIsLoading(false);
        })
    },[]);

    const pendingOrders = orders.filter(order => !order.delivered);
    const readyOrders = orders.filter(order => order.delivered);

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
                        <th>Entregado</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={4}>
                                <div className="py-6">
                                    <Spinner fullWidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {pendingOrders.length > 0 && pendingOrders.map(order => (
                        <tr key={order._id}>
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
                                    <div key={product._id}>
                                        {product.title} x {product.quantity}<br />
                                    </div>
                                ))}
                            </td>
                            <DeliveredOrder delivered={order.delivered} orderId={order._id}/>
                        </tr>
                    ))}
                    {readyOrders.length > 0 && readyOrders.map(order => (
                        <tr key={order._id}>
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
                                    <div key={product._id}>
                                        {product.title} x {product.quantity}<br />
                                    </div>
                                ))}
                            </td>
                            <DeliveredOrder delivered={order.delivered} orderId={order._id}/>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}