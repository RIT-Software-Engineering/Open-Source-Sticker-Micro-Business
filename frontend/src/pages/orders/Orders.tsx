import type { ReactElement } from "react";
import OrderCard from "./OrderCard";
import Temp from "../../components/display/Temp";
import type { IOrder } from "../../modules/data/Orders";
import Header from "../../components/display/Header";

/** The size (height) of order cards */
const CARD_SIZE = 25;

/**
 * Displays orders
 */
export default function Orders(): ReactElement {
    const orders: IOrder[] = [0, 1, 2].map(id => ({id}));

    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        <div style={{display: "flex", flexDirection: "row", flex: 1}}>
            <div style={{display: "flex", flexDirection: "column", flex: 1, marginRight: 5}}>
                {/* Current orders */}
                <Header name="Current Orders"/>
                {orders.map((order, index) => <div key={index} style={{marginTop: 5}}>
                    <OrderCard order={order} size={CARD_SIZE}/>
                </div>)}
                
                <div style={{margin: 20}}/>

                {/* Closed orders */}
                <Header name="Closed Orders"/>
                {orders.map((order, index) => <div key={index} style={{marginTop: 5}}>
                    <OrderCard order={order} size={CARD_SIZE}/>
                </div>)}
            </div>
            <div style={{display: "flex", flexDirection: "column", flex: 1, marginLeft: 5}}>
                {/* Recieved orders */}
                <Temp name="Recieved Orders"/>

                <div style={{margin: 5}}/>

                {/* Order data */}
                <Temp name="Graph Thing whatever"/>
            </div>
        </div>
    </div>
}