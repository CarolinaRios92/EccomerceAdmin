import axios from "axios";
import { useState } from "react"

export default function DeliveredOrder ({delivered, orderId}){
    const [deliveredOrder, setDeliveredOrder] = useState(delivered);

    async function changeDelivered(){
        await axios.put(`/api/orders?orderId=${orderId}`, {
            delivered: !deliveredOrder,
        }).then(
            setDeliveredOrder(prev => !prev)
        )
    }

    return (
        <td className="text-center">  
            <p className={deliveredOrder ? "text-green-600" : "text-red-600"}>
                {deliveredOrder ? "SI" : "NO"}
            </p>
            <button 
                type="button"
                className="btn-default text-sm mb-2 mt-1"
                onClick={changeDelivered}>
                    Entregado
            </button>
        </td>
    )
}