import "./library.css";
import { useState, type ReactElement } from "react";
import { GetExampleSticker, type ISticker } from "../../../modules/data/Sticker";
import { useColors } from "../../../modules/Colors";
import Button from "../../../components/control/Button";
import type { ICollection } from "../../../modules/data/Collection";
import useText from "../../../modules/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Collection from "./Section";
import { useIsMobile } from "../../../modules/Hooks";
import Search from "../../../components/control/Search";

/**
 * The admin's sticker library
 */
export default function Library(): ReactElement {
    const [stickers, _setStickers] = useState<ISticker[]>([
        GetExampleSticker(0),
        GetExampleSticker(1),
        GetExampleSticker(2),
        GetExampleSticker(3),
        GetExampleSticker(4),
        GetExampleSticker(5)
    ]);

    const [collections, _setCollections] = useState<ICollection[]>([
        {id: 0, name: "Collection A", stickers: new Set([0, 1, 2])},
        {id: 1, name: "Collection B", stickers: new Set([3, 4, 5])}
    ]);

    const text = useText();
    const colors = useColors();
    const isMobile = useIsMobile();

    return <div className="library-container">
        <div className="library-header">
            <div className="library-about">
                <h2>{text.library.title}</h2>
                <div className="library-description" style={{color: colors.neutralPalatte.Darkest()}}>{text.library.desc}</div>
            </div>

            <div className="library-control-positioner">
                <div className="library-control-shaper" style={{flexDirection: isMobile ? "column" : "row"}}>
                    <Button size="medium" color={colors.primary} className="library-control">
                        <FontAwesomeIcon icon={faPlus} className="library-control-add-icon"/>
                        <div>{text.library.newSticker}</div>
                    </Button>
                    <Button size="medium" color={colors.primary} className="library-control">
                        <FontAwesomeIcon icon={faPlus} className="library-control-add-icon"/>
                        <div>{text.library.newCollection}</div>
                    </Button>
                </div>
            </div>
        </div>

        <Search/>

        <div className="library-content">
            <Collection collection={{id: -1, name: text.library.collections.allStickers, stickers: new Set(stickers.map(sticker => sticker.id))}} stickers={stickers} disallowEdit/>
            {collections.map(collection => <div key={collection.id}>
                <Collection collection={collection} stickers={stickers}/>
            </div>)}
        </div>
    </div>
}