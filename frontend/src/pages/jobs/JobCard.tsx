import type { ReactElement } from "react";
import Temp from "../../components/display/Temp";
import type { IJob } from "../../modules/data/Jobs";
import type { Callback } from "../../Types";
import Button from "../../components/control/Button";

export interface IJobCardProps {
    /** The job to display */
    job     : IJob;
    /** The size of the card */
    size    : number;
    /** What to do when the card is clicked */
    onClick?: Callback | undefined;
}

/**
 * Displays some amount of information about a job as a card
 */
export default function JobCard({job, size, onClick}: IJobCardProps): ReactElement {
    return <div style={{display: "flex", flexDirection: "row"}}>
        <Button onClick={onClick} style={{display: "flex", flex: 1, backgroundColor: "#00000000", padding: 0, border: "none"}}>
            <div style={{height: size, display: "flex", flex: 1}}>
                <Temp name=""/>
            </div>
        </Button>
    </div>
}