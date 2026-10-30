import type { ReactElement } from "react";
import Temp from "../../components/display/Temp";
import type { IOrder } from "../../modules/data/Orders";
import type { Callback } from "../../Types";
import Button from "../../components/control/Button";

export interface IOrderCardProps {
    /** The order to display */
    order   : IOrder;
    /** The size of the card */
    size    : number;
    /** What to dow when the card is clicked */
    onClick?: Callback | undefined;
}

/**
 * Displays some details about an order
 */
export default function OrderCard({order, size, onClick}: IOrderCardProps): ReactElement {
    return <div style={{display: "flex", flexDirection: "row"}}>
        <Button onClick={onClick} style={{display: "flex", flex: 1, backgroundColor: "#00000000", padding: 0, border: "none"}}>
            <div style={{height: size, display: "flex", flex: 1}}>
                <Temp name=""/>
            </div>
        </Button>
    </div>
}