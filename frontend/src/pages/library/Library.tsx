import { useState, type ReactElement } from "react";
import type { ISticker } from "../../modules/data/Sticker";
import { useColors } from "../../modules/Colors";
import Button from "../../components/control/Button";
import type { ICollection } from "../../modules/data/Collection";
import { randomPick } from "../../modules/Utility";
import useText from "../../modules/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Collection from "./Section";
import { useIsMobile } from "../../modules/Hooks";
import Search from "../../components/control/Search";

/** The size of listing cards */
const CARD_SIZE = 250;
/** The padding for the add listing modal */
const MODAL_PADDING = 20;

/**
 * The shop page
 */
export default function Library(): ReactElement {
    // /** Is the user currently adding a listing */
    // const [adding, setAdding] = useState<boolean>(false);

    // const colors = useColors();
    // const stickers: ISticker[] = [0, 1, 2, 3, 4, 5].map(id => ({id, name: `Sticker ${id}`, designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg", physicalHeight: Math.random(), physicalWidth: Math.random()}));
    // const categories: ICategory[] = [0, 1].map(id => ({id, name: `Category ${id}`, stickers: new Set(stickers.map(sticker => sticker.id))}));

    // const navigate = useNavigate();
    // const user = useUser();

    // /**
    //  * What to do when a listing is added
    //  */
    // const OnSubmitAddition = () => {
    //     // TODO

    //     setAdding(false);
    // }

    // return <div style={{display: "flex", flexDirection: "column", flex: 1}}>
    //     <Search/>

    //     {user?.IsAdmin
    //         ? <Button style={{marginRight: "auto", marginBottom: 10}} onClick={() => setAdding(true)}>Add Sticker</Button>
    //         : undefined
    //     }

    //     <div style={{display: "flex", flexDirection: "column", rowGap: 15}}>
    //         {categories.map(category => <Category key={category.id} category={category} stickers={stickers}/>)}
    //     </div>

    //     {/* Add listing modal */}
    //     <ReactModal contentLabel="Add Listing" isOpen={adding} onRequestClose={() => setAdding(false)} style={{content: {padding: MODAL_PADDING, display: "flex", flexDirection: "column"}, overlay: {overflowY: "scroll"}}}>
    //         <AddSticker
    //             screenPadding={MODAL_PADDING}
    //             onSubmit={OnSubmitAddition}
    //             onCancel={() => setAdding(false)}
    //         />
    //     </ReactModal>
    // </div>

    const [stickers, setStickers] = useState<ISticker[]>([
        {id: 0, designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg", name: "Sticker 0", physicalHeight: Math.random() * 10, physicalWidth: Math.random() * 10, description: "This is an example sticker"},
        {id: 1, designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg", name: "Sticker 1", physicalHeight: Math.random() * 10, physicalWidth: Math.random() * 10, description: "This is an example sticker"},
        {id: 2, designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg", name: "Sticker 2", physicalHeight: Math.random() * 10, physicalWidth: Math.random() * 10, description: "This is an example sticker"},
        {id: 3, designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg", name: "Sticker 3", physicalHeight: Math.random() * 10, physicalWidth: Math.random() * 10, description: "This is an example sticker"},
        {id: 4, designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg", name: "Sticker 4", physicalHeight: Math.random() * 10, physicalWidth: Math.random() * 10, description: "This is an example sticker"},
        {id: 5, designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg", name: "Sticker 5", physicalHeight: Math.random() * 10, physicalWidth: Math.random() * 10, description: "This is an example sticker"},
    ]);

    const [collections, setCollections] = useState<ICollection[]>([
        {id: 0, name: "Collection A", stickers: new Set([0, 1, 2])},
        {id: 1, name: "Collection B", stickers: new Set([3, 4, 5])}
    ]);

    const text = useText();
    const colors = useColors();
    const isMobile = useIsMobile();

    return <div style={{padding: 5, flex: 1, overflowY: "visible"}}>
        <div style={{display: "flex", flexDirection: "row", flex: 1, marginBottom: 15}}>
            <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                <h2>{text.library.title}</h2>
                <div style={{maxWidth: 500, color: colors.neutralPalatte.Darkest()}}>{text.library.desc}</div>
            </div>

            <div style={{width: 25}}/>

            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", flex: 1}}>
                    <div style={{display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px"}}>
                        <Button size="medium" color={colors.primary} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <FontAwesomeIcon icon={faPlus} style={{fontSize: 25, marginRight: 10}}/>
                            <div>{text.library.newSticker}</div>
                        </Button>
                        <Button size="medium" color={colors.primary} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <FontAwesomeIcon icon={faPlus} style={{fontSize: 25, marginRight: 10}}/>
                            <div>{text.library.newCollection}</div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <Search/>

        <div style={{display: "flex", flexDirection: "column", flex: 1, rowGap: 10}}>
            <Collection collection={{id: -1, name: text.library.collections.allStickers, stickers: new Set(stickers.map(sticker => sticker.id))}} stickers={stickers} disallowEdit cardSize={CARD_SIZE}/>
            {collections.map(collection => <div key={collection.id}>
                <Collection collection={collection} stickers={stickers} cardSize={CARD_SIZE}/>
            </div>)}
        </div>
    </div>
}