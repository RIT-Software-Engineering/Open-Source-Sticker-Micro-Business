import type { ReactElement } from "react";
import Temp from "../../components/display/Temp";
import type { IJob } from "../../components/data/Jobs";
import type { Callback } from "../../Types";

export interface IJobCardProps {
    job     : IJob;
    size    : number;
    onClick?: Callback | undefined;
}

export default function JobCard({job, size, onClick}: IJobCardProps): ReactElement {
    return <div style={{display: "flex", flexDirection: "row"}}>
        <button onClick={onClick} style={{display: "flex", flex: 1, backgroundColor: "#00000000", padding: 0, border: "none"}}>
            <div style={{height: size, display: "flex", flex: 1}}>
                <Temp name=""/>
            </div>
        </button>
    </div>
}