import { useState, type ReactElement } from "react";
import ListingCard from "./ListingCard";
import type { IListing } from "../../modules/data/Listing";
import { useColors } from "../../modules/Colors";
import { useNavigate } from "react-router";
import ReactModal from "react-modal";
import AddListing from "./AddListing";

/** The size of listing cards */
const CARD_SIZE = 100;
/** The padding for the add listing modal */
const MODAL_PADDING = 20;

/**
 * The shop page
 */
export default function Shop(): ReactElement {
    /** Is the user currently adding a listing */
    const [adding, setAdding] = useState<boolean>(false);

    const colors = useColors();
    const listings: IListing[] = [0, 1, 2, 3, 4, 5].map(id => ({id}));

    const navigate = useNavigate();

    /**
     * What to do when a listing is added
     */
    const OnSubmitAddition = () => {
        // TODO

        setAdding(false);
    }

    return <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", rowGap: 15}}>
        {/* Add listing button */}
        <div style={{flex: 1, justifyContent: "center", display: "flex"}} key={-1}>
            <ListingCard listing={null} size={CARD_SIZE} onClick={() => setAdding(true)}>
                <div style={{borderStyle: "solid", display: "flex", flex: 1, flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", borderColor: colors.neutralPalatte.Lighter(), borderWidth: 1}}>
                    <p style={{fontSize: CARD_SIZE / 2}}>+</p>
                    <p>Add Listing</p>
                </div>
            </ListingCard>
        </div>

        {/* Listings */}
        {listings.map((listing, index) => <div style={{flex: 1, justifyContent: "center", display: "flex"}} key={index}>
            <ListingCard listing={listing} size={CARD_SIZE} onClick={() => navigate(`${listing.id}`)}/>
        </div>)}

        {/* Row align listings */}
        {new Array(Math.floor(window.innerWidth / CARD_SIZE)).fill(0).map((_, index) => <div style={{flex: 1, justifyContent: "center", display: "flex"}} key={-index - 1}>
            <ListingCard silent size={CARD_SIZE}><></></ListingCard>
        </div>)}

        {/* Add listing modal */}
        <ReactModal contentLabel="Add Listing" isOpen={adding} onRequestClose={() => setAdding(false)} style={{content: {padding: MODAL_PADDING, display: "flex", flexDirection: "column"}, overlay: {overflowY: "scroll"}}}>
            <AddListing
                screenPadding={MODAL_PADDING}
                onSubmit={OnSubmitAddition}
                onCancel={() => setAdding(false)}
            />
        </ReactModal>
    </div>
}