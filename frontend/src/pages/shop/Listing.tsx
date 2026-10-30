import type { ReactElement } from "react";
import { useNavigate, useParams } from "react-router";
import Button from "../../components/control/Button";

/**
 * A page displaying a single listing
 * 
 * @param id Takes an id path parameter corresponding to a listing id
 */
export default function Listing(): ReactElement {
    const {id} = useParams();
    const navigate = useNavigate()

    return <div>
        <div style={{display: "flex", flexDirection: "row"}}>
            <Button style={{padding: "5px", textDecorationLine: "underline"}} onClick={() => navigate("..")}>
                {"< Back to listings"}
            </Button>
        </div>

        {/* Content here */}
    </div>
}