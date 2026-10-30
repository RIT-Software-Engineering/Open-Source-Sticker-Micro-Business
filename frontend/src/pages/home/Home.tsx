import type { ReactElement } from "react";
import JobUpdates from "./JobUpdates";
import OrderUpdates from "./OrderUpdates";
import ShopStats from "./ShopStats";

/**
 * The admin homepage
 */
export default function Home(): ReactElement {
    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        <div style={{display: "flex", flexDirection: "row", flex: 1, marginBottom: 10}}>
            {/* Job updates */}
            <JobUpdates/>

            <div style={{margin: 5}}/>

            {/* Order updates */}
            <OrderUpdates/>
        </div>

        {/* Shop stats */}
        <ShopStats/>
    </div>
}