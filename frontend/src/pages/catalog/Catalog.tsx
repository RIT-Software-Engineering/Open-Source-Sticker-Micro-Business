import "./catalog.css";
import { useCallback, useReducer, useState, type ReactElement } from "react";
import { GetExampleSticker, type ILocalSticker, type ISticker } from "../../modules/data/Sticker";
import { useColors } from "../../modules/Colors";
import Button from "../../components/control/Button";
import type { ICollection } from "../../modules/data/Collection";
import useText from "../../modules/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Collection from "./Collection";
import { useIsMobile } from "../../modules/Hooks";
import Search from "../../components/control/Search";
import AddSticker from "./AddSticker";

export interface ICatalogProps {
    /** Is this live (can you not edit) */
    live         : boolean;
    /** The title of the page */
    title        : string;
    /** The description of the page */
    desc         : string;
    /** What to do when requesting to add a sticker, do not pass to not show the button */
    onAddSticker?: ((sticker: ISticker, quantity?: number) => unknown) | undefined;
}

/**
 * The admin's sticker library
 */
export default function Catalog({live, title, desc, onAddSticker}: ICatalogProps): ReactElement {
    /** All stickers to display */
    const [stickers, _setStickers] = useState<ISticker[]>([
        GetExampleSticker(0),
        GetExampleSticker(1),
        GetExampleSticker(2),
        GetExampleSticker(3),
        GetExampleSticker(4),
        GetExampleSticker(5)
    ]);

    /** The collections to display */
    const [collections, _setCollections] = useState<ICollection[]>([
        {id: 0, name: "Collection A", stickers: new Set([0, 1, 2])},
        {id: 1, name: "Collection B", stickers: new Set([3, 4, 5])}
    ]);

    const text = useText();
    const colors = useColors();
    const isMobile = useIsMobile();

    const [addingSticker, setAddingSticker] = useState<boolean>(false);
    const [addStickerKey, updateAddStickerKey] = useReducer(_ => Math.random(), 0);

    const OnUploadSticker = useCallback((sticker: ILocalSticker) => {
        updateAddStickerKey();
        setAddingSticker(false);
        sticker;
    }, [updateAddStickerKey, setAddingSticker]);

    return <div className="scrollable">
        <div className="catalog-container">
            <div className="catalog-header">
                <div className="catalog-about">
                    <h2>{title}</h2>
                    <div className="catalog-description" style={{color: colors.neutralPalatte.Darkest()}}>{desc}</div>
                </div>

                {!live
                    ? <div className="catalog-control-positioner">
                        <div className="catalog-control-shaper" style={{flexDirection: isMobile ? "column" : "row"}}>
                            <Button size="medium" color={colors.primary} className="catalog-control" onClick={() => setAddingSticker(true)}>
                                <FontAwesomeIcon icon={faPlus} className="catalog-control-add-icon"/>
                                <div>{text.library.newSticker}</div>
                            </Button>
                            <Button size="medium" color={colors.primary} className="catalog-control">
                                <FontAwesomeIcon icon={faPlus} className="catalog-control-add-icon"/>
                                <div>{text.library.newCollection}</div>
                            </Button>
                        </div>
                    </div> : undefined
                }
            </div>

            <Search/>

            <div className="catalog-content">
                <Collection
                    collection={{id: -1, name: text.library.collections.allStickers, stickers: new Set(stickers.map(sticker => sticker.id))}}
                    stickers={stickers}
                    disallowEdit
                    onAddSticker={live ? onAddSticker : undefined}
                />
                {collections.map(collection => <Collection
                    key={collection.id}
                    collection={collection}
                    stickers={stickers}
                    disallowEdit={live}
                    onAddSticker={live ? onAddSticker : undefined}
                />)}
            </div>
        </div>

        <AddSticker
            key={addStickerKey}
            open={addingSticker}
            onCancel={() => {setAddingSticker(false); updateAddStickerKey();}}
            onSubmit={OnUploadSticker}
        />
    </div>
}