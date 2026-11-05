import type { ReactElement } from "react";
import JobUpdates from "./JobUpdates";
import OrderUpdates from "./OrderUpdates";
import ShopStats from "./ShopStats";
import useText, { TemplateText } from "../../../modules/Text";
import { useUser } from "../../../modules/User";

/**
 * The admin homepage
 */
export default function Home(): ReactElement {
    const user = useUser();
    const text = useText();

    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        <h2 style={{marginBottom: 5}}>{TemplateText(text.home.greeting, user?.Name ?? text.user.guest)}</h2>

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