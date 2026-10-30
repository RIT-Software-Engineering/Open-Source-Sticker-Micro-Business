import type { ReactElement, ReactNode } from "react";
import type { IListing } from "../../modules/data/Listing";
import type { StateRef } from "../../Types";
import { useColors } from "../../modules/Colors";
import Button from "../../components/control/Button";

export interface IListingCardProps {
    /** The listing to display */
    listing? : IListing  | undefined | null;
    /** The size of the card */
    size     : number;
    /** What to do when the card is clicked */
    onClick? : StateRef<IListing | undefined | null> | undefined;
    children?: ReactNode | undefined;
    /** Should this card respond like a button */
    silent?  : boolean   | undefined
}

/**
 * Displays some details about a listing as a card
 */
export default function ListingCard({silent, listing, size, onClick, children}: IListingCardProps): ReactElement {
    const colors = useColors();

    return <Button silent={silent} onClick={onClick != null ? () => onClick(listing) : undefined} style={{width: size, padding: 5, display: "flex", flexDirection: "column", alignItems: "center", borderStyle: "none", backgroundColor: "#00000000"}}>
        {children ?? <>
            <div style={{width: "100%", aspectRatio: 1, backgroundColor: colors.neutralPalatte.Lighter(), marginBottom: 5}}/>
            <p style={{fontWeight: "bold", fontSize: 16}}>Sticker</p>
            <p style={{fontStyle: "italic"}}>$0.00</p>
        </>}
    </Button>
}