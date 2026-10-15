import type { ReactElement, ReactNode } from "react";
import type { IListing } from "../../components/data/Listing";
import { useColors } from "../../modules/context/Colors";
import type { Callback } from "../../Types";

export interface IListingCardProps {
    listing  : IListing;
    size     : number;
    onClick? : Callback  | undefined;
    children?: ReactNode | undefined;
}

export default function ListingCard({listing, size, onClick, children}: IListingCardProps): ReactElement {
    const colors = useColors();

    return <button onClick={onClick} style={{width: size, padding: 5, display: "flex", flexDirection: "column", alignItems: "center", borderStyle: "none", backgroundColor: "#00000000"}}>
        {children ?? <>
            <div style={{width: "100%", aspectRatio: 1, backgroundColor: colors.accent, marginBottom: 5}}/>
            <p style={{fontWeight: "bold", fontSize: 16}}>Sticker</p>
            <p style={{fontStyle: "italic"}}>$0.00</p>
        </>}
    </button>
}