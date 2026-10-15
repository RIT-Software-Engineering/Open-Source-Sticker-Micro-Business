import type { ReactElement } from "react";
import Temp from "../../components/display/Temp";
import type { IOrder } from "../../components/data/Orders";
import type { Callback } from "../../Types";

export interface IOrderCardProps {
    order   : IOrder;
    size    : number;
    onClick?: Callback | undefined;
}

export default function OrderCard({order, size, onClick}: IOrderCardProps): ReactElement {
    return <div style={{display: "flex", flexDirection: "row"}}>
        <button onClick={onClick} style={{display: "flex", flex: 1, backgroundColor: "#00000000", padding: 0, border: "none"}}>
            <div style={{height: size, display: "flex", flex: 1}}>
                <Temp name=""/>
            </div>
        </button>
    </div>
}