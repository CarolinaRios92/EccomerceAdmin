import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import axios from "axios";
import subHours from "date-fns/subHours";

export default function HomeStats(){
    const [orders, setOrders] = useState([]);
    const[isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        axios.get("api/orders").then(res => {
            setOrders(res.data);
            setIsLoading(false);
        })
    },[]);

    if(isLoading){
        return (
            <div className="my-20">
                <Spinner fullWidth={true} />
            </div>
        )
    }

    const ordersToday = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24));
    const ordersWeek = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*7));
    const ordersMonth = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*30));
    
    function ordersTotal(orders){
        let sum = 0;
        orders.forEach(order => {
            const {line_items} = order;
            line_items.forEach(li => {
                const lineSum = li.quantity * li.unit_price;
                sum += lineSum;
            });
        });
        return sum;
    } 

    return(
        <div>
            <h2>Ordenes</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">
                        Hoy
                    </h3>
                    <div className="tile-number">{ordersToday.length}</div>
                    <div className="title-desc">{ordersToday.length} ordenes hoy</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Esta Semana
                    </h3>
                    <div className="tile-number">{ordersWeek.length}</div>
                    <div className="title-desc">{ordersWeek.length} ordenes esta semana</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Este Mes
                    </h3>
                    <div className="tile-number">{ordersMonth.length}</div>
                    <div className="title-desc">{ordersMonth.length} ordenes este Mes</div>
                </div>
            </div>

            <h2>Ganacias</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">
                        Hoy
                    </h3>
                    <div className="tile-number">${ordersTotal(ordersToday)}</div>
                    <div className="title-desc">{ordersToday.length} ordenes hoy</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Esta Semana
                    </h3>
                    <div className="tile-number">${ordersTotal(ordersWeek)}</div>
                    <div className="title-desc">{ordersWeek.length} ordenes esta semana</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">
                        Este Mes
                    </h3>
                    <div className="tile-number">${ordersTotal(ordersMonth)}</div>
                    <div className="title-desc">{ordersMonth.length} ordenes este Mes</div>
                </div>
            </div>
        </div>
    )
}