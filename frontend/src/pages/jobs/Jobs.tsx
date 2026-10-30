import type { ReactElement } from "react";
import Header from "../../components/display/Header";
import type { IOrder } from "../../modules/data/Orders";
import JobCard from "./JobCard";

/** The size of the job cards */
const CARD_SIZE = 25;

/**
 * Displays jobs
 */
export default function Jobs(): ReactElement {
    const currentJobs : IOrder[] = [0, 1, 2].map(id => ({id}));
    const previousJobs: IOrder[] = [0, 1, 2].map(id => ({id}));

    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        {/* Current jobs */}
        <Header name="Current Jobs"/>
        {currentJobs.map((job, index) => <div key={index} style={{marginTop: 5}}>
            <JobCard job={job} size={CARD_SIZE}/>
        </div>)}

        <div style={{margin: 20}}/>

        {/* Previous jobs */}
        <Header name="Previous Jobs"/>
        {previousJobs.map((job, index) => <div key={index} style={{marginTop: 5}}>
            <JobCard job={job} size={CARD_SIZE}/>
        </div>)}
    </div>
}