import type { ReactElement, ReactNode } from "react";
import type { ISticker } from "../../modules/data/Sticker";
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

    return <Button silent={silent} onClick={onClick != null ? () => onClick(sticker) : undefined} style={{width: size, padding: PREVIEW_PADDING, display: "flex", flexDirection: "column", alignItems: "center", borderStyle: "none", backgroundColor: "#00000000"}}>
        {children ?? <>
            <img src={sticker?.designPath} width={size - PREVIEW_PADDING * 2} alt={sticker?.name}></img>
            <p style={{fontWeight: "bold", fontSize: 16}}>Sticker</p>
            <p style={{fontStyle: "italic"}}>$0.00</p>
        </>}
    </Button>
}