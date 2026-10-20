import type { ReactElement, ReactNode } from "react";
import type { IListing } from "../../components/data/Listing";
import type { StateRef } from "../../Types";
import { useColors } from "../../modules/Colors";

export interface IListingCardProps {
    listing? : IListing  | undefined | null;
    size     : number;
    onClick? : StateRef<IListing | undefined | null> | undefined;
    children?: ReactNode | undefined;
}

export default function ListingCard({listing, size, onClick, children}: IListingCardProps): ReactElement {
    const colors = useColors();

    const OnClick = () => {
        if(onClick != null) onClick(listing);
    }

    return <button onClick={OnClick} style={{width: size, padding: 5, display: "flex", flexDirection: "column", alignItems: "center", borderStyle: "none", backgroundColor: "#00000000"}}>
        {children ?? <>
            <div style={{width: "100%", aspectRatio: 1, backgroundColor: colors.neutralPalatte.Lighter(), marginBottom: 5}}/>
            <p style={{fontWeight: "bold", fontSize: 16}}>Sticker</p>
            <p style={{fontStyle: "italic"}}>$0.00</p>
        </>}
    </button>
}