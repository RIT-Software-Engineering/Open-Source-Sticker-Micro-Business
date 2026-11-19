import type { CSSProperties } from "react"

export interface IDisabledProps {
    /** The shade of the overlay */
    shade: CSSProperties["color"];
}

/**
 * A disabled overlay over top of a controllable  
 * Note that the root component should have position:relative
 */
export default function Disabled({shade}: IDisabledProps) {
    return <div className="generic-button-overlay" style={{backgroundColor: shade}}/>
}