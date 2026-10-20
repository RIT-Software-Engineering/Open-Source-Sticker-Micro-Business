import type { ReactElement } from "react";
import type { INavigableProps } from "../../modules/Navigator";
import OrderCard from "./OrderCard";
import Temp from "../../components/display/Temp";
import type { IOrder } from "../../components/data/Orders";
import Header from "../../components/display/Header";

const CARD_SIZE = 25;

export default function Orders({nav}: INavigableProps): ReactElement {
    const orders: IOrder[] = [0, 1, 2].map(id => ({id}));

    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        Orders
        <div style={{display: "flex", flexDirection: "row", flex: 1}}>
            <div style={{display: "flex", flexDirection: "column", flex: 1, marginRight: 5}}>
                <Header name="Current Orders"/>

                {orders.map((order, index) => <div key={index} style={{marginTop: 5}}>
                    <OrderCard order={order} size={CARD_SIZE}/>
                </div>)}
                <div style={{margin: 20}}/>
                <Header name="Closed Orders"/>
                {orders.map((order, index) => <div key={index} style={{marginTop: 5}}>
                    <OrderCard order={order} size={CARD_SIZE}/>
                </div>)}
            </div>
            <div style={{display: "flex", flexDirection: "column", flex: 1, marginLeft: 5}}>
                <Temp name="Recieved Orders"/>
                <div style={{margin: 5}}/>
                <Temp name="Graph Thing whatever"/>
            </div>
        </div>
    </div>
}