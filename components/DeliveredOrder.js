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

    console.log(deliveredOrder);

    return (
        <>
            {deliveredOrder ? <>SI</> : <>NO</>}
            <button 
                type="button"
                className="btn-default text-sm mb-2 mt-1"
                onClick={changeDelivered}>
                    Entregado
            </button>
        </>
    )
}