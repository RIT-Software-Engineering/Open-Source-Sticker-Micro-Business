import { useMemo, useState, type ReactElement } from "react";
import StickerCard from "./StickerCard";
import type { ISticker } from "../../modules/data/Sticker";
import { useColors } from "../../modules/Colors";
import { useNavigate } from "react-router";
import ReactModal from "react-modal";
import AddSticker from "./AddSticker";
import Input from "../../components/control/Input";
import Button from "../../components/control/Button";
import type { ICategory } from "../../modules/data/Category";
import { useUser } from "../../modules/User";
import { randomPick } from "../../modules/Utility";
import useText from "../../modules/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

/** The size of listing cards */
const CARD_SIZE = 150;
/** The padding for the add listing modal */
const MODAL_PADDING = 20;

function Search(): ReactElement {
    const colors = useColors();

    return <div style={{display: "flex", flexDirection: "row", marginBottom: 5, justifyContent: "center"}}>
        <div style={{flexDirection: "row", display: "flex"}}>
            <Input style={{minWidth: 250}} placeholder="I want to find..."/>
            <Button color={colors.neutral} style={{padding: "5px 10px", borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
                Search
            </Button>
        </div>
    </div>
}

interface ICategoryProps {
    category: ICategory;
    stickers: ISticker[];
}

function Category({category, stickers}: ICategoryProps): ReactElement {
    const colors = useColors();
    const navigate = useNavigate();

    const contents = useMemo(() => {
        const result = [];
        for(const sticker of stickers) {
            if(category.stickers.has(sticker.id)) {
                result.push(sticker);
            }
        } return result;
    }, [category, stickers]);

    return <>
        <div style={{backgroundColor: colors.neutralPalatte.Light(), borderStyle: "solid", borderWidth: 1, textAlign: "center"}}>
            {category.name}
        </div>
        <div style={{}}>
            <div style={{flexDirection: "row", display: "flex", overflow: "hidden"}}>
                {/* {contents.map((sticker) => <div style={{width: 100, margin: 10, height: 100, backgroundColor: "red"}}/>)} */}
                {contents.map((sticker) => <StickerCard key={sticker.id} sticker={sticker} size={CARD_SIZE} onClick={() => navigate(`${sticker.id}`)}/>)}
            </div>
        </div>
    </>
}

/**
 * The shop page
 */
export default function Shop(): ReactElement {
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

    const text = useText();
    const colors = useColors();

    return <div style={{padding: 5, flex: 1}}>
        <div style={{display: "flex", flexDirection: "row", flex: 1, marginBottom: 15}}>
            <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                <h2>{text.shop.title}</h2>
                <div style={{maxWidth: 250}}>{text.shop.desc}</div>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", flex: 1}}>
                    <Button color={colors.secondary} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <FontAwesomeIcon icon={faPlus} style={{fontSize: 25, marginRight: 10}}/>
                        <div>{text.shop.new}</div>
                    </Button>
                </div>
            </div>
        </div>

        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <div style={{flex: 1}}/>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 10}}>
                <FontAwesomeIcon icon={faSearch} style={{fontSize: 25, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderStyle: "solid", borderWidth: 1, padding: 5}}/>
                <input style={{fontSize: 22, flex: 1}}/>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", borderTopRightRadius: 4, borderBottomRightRadius: 4, borderStyle: "solid", borderWidth: 1, padding: 5}}>
                    Newest first
                    <FontAwesomeIcon icon={faChevronDown} style={{fontSize: 25}}/>
                </div>
            </div>
            <div style={{flex: 1}}/>

        </div>
    </div>
}