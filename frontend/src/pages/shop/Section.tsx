import type { ReactElement } from "react";
import type { ICollection } from "../../modules/data/Collection";
import type { ISticker } from "../../modules/data/Sticker";
import { useColors } from "../../modules/Colors";
import useConfig from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/control/Button";
import useText, { TemplateText } from "../../modules/Text";
import StickerCard from "./StickerCard";

export interface ICollectionProps {
    collection   : ICollection;
    stickers     : ISticker[];
    disallowEdit?: boolean;
    cardSize     : number;
}

export default function Collection({collection, stickers: allStickers, disallowEdit, cardSize}: ICollectionProps): ReactElement {
    const text = useText();
    const colors = useColors();
    const config = useConfig();

    const ownedStickers = allStickers.filter(sticker => collection.stickers.has(sticker.id));

    return <div style={{display: "flex", flexDirection: "column", rowGap: 10}}>
        <div style={{display: "flex", flex: 1, backgroundColor: colors.primaryPalatte.Light(colors.primaryPalatte.Light()), borderRadius: config.borderRadius, padding: "4px 8px", alignItems: "center"}}>
            {!disallowEdit
                ? <Button size="tiny" color={colors.primary} style={{margin: 5, marginRight: 10}}>Edit</Button>
                : <div style={{padding: "10px 0", color: "#00000000"}}>a</div>
            }
            <div style={{display: "flex", flexDirection: "row", flex: 1}}>
                <h3>{collection.name}</h3>
            </div>

            <div>{TemplateText(text.shop.collections.stickerCount, ownedStickers.length.toString())}</div>
            {!disallowEdit
                ? <FontAwesomeIcon icon={faBars} style={{fontSize: 24, marginLeft: 7.5}}/>
                : undefined
            }
        </div>

        <div style={{display: "flex", flexDirection: "row", overflowX: "auto", columnGap: 10, paddingBottom: 5}}>
            {ownedStickers.map(sticker => <div key={sticker.id}>
                <StickerCard sticker={sticker} cardSize={cardSize}/>
            </div>)}
        </div>
    </div>
}