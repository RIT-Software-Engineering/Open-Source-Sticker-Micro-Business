import "./Section.css";
import { useMemo, type ReactElement } from "react";
import type { ICollection } from "../../../modules/data/Collection";
import type { ISticker } from "../../../modules/data/Sticker";
import { useColors } from "../../../modules/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/control/Button";
import useText, { TemplateText } from "../../../modules/Text";
import StickerCard from "./StickerCard";

export interface ICollectionProps {
    /** The collection to display */
    collection   : ICollection;
    /** All of the stickers in the library */
    stickers     : ISticker[];
    /** Should the user not be allowed to edit this collection (all stickers) */
    disallowEdit?: boolean;
}

/**
 * A collection of stickers
 */
export default function Collection({collection, stickers: allStickers, disallowEdit}: ICollectionProps): ReactElement {
    const text = useText();
    const colors = useColors();

    const ownedStickers = useMemo(() => allStickers.filter(sticker => collection.stickers.has(sticker.id)), [collection, allStickers]);

    return <div className="library-section-container">
        <div className="library-section-header" style={{backgroundColor: colors.primaryPalatte.Light(colors.primaryPalatte.Light())}}>
            {!disallowEdit
                ? <Button className="library-section-edit" size="tiny" color={colors.primary}>Edit</Button>
                : <div className="library-section-noedit">a</div>
            }
            <div className="library-section-name">
                <h3>{collection.name}</h3>
            </div>

            <div>{TemplateText(text.library.collections.stickerCount, ownedStickers.length.toString())}</div>
            {!disallowEdit
                ? <FontAwesomeIcon className="library-section-move" icon={faBars}/>
                : undefined
            }
        </div>

        <div className="library-section-body">
            {ownedStickers.map(sticker => <StickerCard key={sticker.id} sticker={sticker}/>)}
        </div>
    </div>
}