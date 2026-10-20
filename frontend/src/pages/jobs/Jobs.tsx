import type { ReactElement } from "react";
import type { INavigableProps } from "../../modules/Navigator";
import Header from "../../components/display/Header";
import type { IOrder } from "../../components/data/Orders";
import JobCard from "./JobCard";

const CARD_SIZE = 25;

export default function Jobs({nav}: INavigableProps): ReactElement {
    const currentJobs : IOrder[] = [0, 1, 2].map(id => ({id}));
    const previousJobs: IOrder[] = [0, 1, 2].map(id => ({id}));

    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        Jobs
        <div style={{margin: 5}}/>
        <Header name="Current Jobs"/>
        {currentJobs.map((job, index) => <div key={index} style={{marginTop: 5}}>
            <JobCard job={job} size={CARD_SIZE}/>
        </div>)}
        <div style={{margin: 20}}/>
        <Header name="Previous Jobs"/>
        {previousJobs.map((job, index) => <div key={index} style={{marginTop: 5}}>
            <JobCard job={job} size={CARD_SIZE}/>
        </div>)}
    </div>
}