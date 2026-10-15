import type { ReactElement } from "react";
import type { INavigableProps } from "../../modules/Navigator";
import JobUpdates from "./JobUpdates";
import OrderUpdates from "./OrderUpdates";
import ShopStats from "./ShopStats";

export default function Home({nav}: INavigableProps): ReactElement {
    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        <div style={{display: "flex", flexDirection: "row", flex: 1, marginBottom: 10}}>
            <JobUpdates/>
            <div style={{margin: 5}}/>
            <OrderUpdates/>
        </div>
        <ShopStats/>
    </div>
}