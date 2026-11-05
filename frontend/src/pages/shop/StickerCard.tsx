import type { ReactElement, ReactNode } from "react";
import { exampleSticker, type ISticker } from "../../modules/data/Sticker";
import type { StateRef } from "../../Types";
import { useColors } from "../../modules/Colors";
import Button from "../../components/control/Button";

const PREVIEW_PADDING = 5;

export interface IListingCardProps {
    /** The listing to display */
    sticker? : ISticker  | undefined | null;
    /** The size of the card */
    size     : number;
    /** What to do when the card is clicked */
    onClick? : StateRef<ISticker | undefined | null> | undefined;
    children?: ReactNode | undefined;
    /** Should this card respond like a button */
    silent?  : boolean   | undefined
}

/**
 * Displays some details about a listing as a card
 */
export default function ListingCard({silent, sticker, size, onClick, children}: IListingCardProps): ReactElement {
    const colors = useColors();

    sticker = sticker ?? exampleSticker();

    return <div style={{width: size, display: "content", flexDirection: "column", alignItems: "center", borderStyle: "none"}}>
        <Button silent={silent} onClick={onClick != null ? () => onClick(sticker) : undefined} style={{backgroundColor: "#00000000", padding: PREVIEW_PADDING}}>
            {children ?? <div>
                <img src={sticker?.designPath} width={size - PREVIEW_PADDING * 2} alt={sticker?.name}></img>
                <p style={{fontWeight: "bold", fontSize: 16}}>{sticker?.name}</p>
                <p style={{fontStyle: "italic"}}>{sticker.physicalWidth.toFixed(2)}" x {sticker.physicalHeight.toFixed(2)}"</p>
            </div>}
        </Button>
        <div style={{display: "flex", flexDirection: "row", padding: "0 10px"}}>
            <Button style={{flex: 1}}>Add to cart</Button>
        </div>
    </div>
}