import type { ReactElement } from "react";
import type { INavigableProps } from "../../modules/Navigator";
import ListingCard from "./ListingCard";
import type { IListing } from "../../components/data/Listing";
import { useColors } from "../../modules/context/Colors";

const CARD_SIZE = 100;

export default function Shop({nav}: INavigableProps): ReactElement {
    const colors = useColors();
    const listings: IListing[] = [0, 1, 2, 3, 4, 5];

    return <div style={{display: "flex", flexDirection: "column", flex: 1, padding: 15}}>
        Shop
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", rowGap: 15}}>
            <div style={{flex: 1, justifyContent: "center", display: "flex"}} key={-1}>
                <ListingCard listing={null} size={CARD_SIZE}>
                    <div style={{borderStyle: "solid", display: "flex", flex: 1, flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", borderColor: colors.accent, borderWidth: 1}}>
                        <p style={{fontSize: CARD_SIZE / 2}}>+</p>
                        <p>Add Listing</p>
                    </div>
                </ListingCard>
            </div>
            {listings.map((listing, index) => <div style={{flex: 1, justifyContent: "center", display: "flex"}} key={index}>
                <ListingCard listing={listing} size={CARD_SIZE}/>
            </div>)}
            {new Array(Math.floor(window.innerWidth / CARD_SIZE)).fill(0).map((value, index) => <div style={{flex: 1, justifyContent: "center", display: "flex"}} key={-index - 1}>
                <ListingCard listing={null} size={CARD_SIZE}><></></ListingCard>
            </div>)}
        </div>
    </div>
}