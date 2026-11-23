import "./Tag.css";
import type { CSSProperties, ReactElement } from "react";
import Button from "../control/Button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Callback } from "../../Types";

export interface ITagProps {
    /** The name of the tag */
    name?    : string   | undefined;
    /** What to do when the tag is clicked */
    onClick? : Callback | undefined;
    /** The color of the tag */
    color?   : CSSProperties["color"];
}

/**
 * A sticker tag
 */
export default function Tag({name, onClick, color}: ITagProps): ReactElement {
    return <div>
        <Button onClick={onClick} color={color} className="tag-button" size="small">
            {name}
            <FontAwesomeIcon icon={faXmark}/>
        </Button>
    </div>
}