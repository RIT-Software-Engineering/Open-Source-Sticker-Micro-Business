import type { ReactElement } from "react";
import type { ISticker } from "../../modules/data/Sticker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useColors } from "../../modules/Colors";
import useConfig from "../../config";
import { trimTrailingZerosRe } from "../../modules/Regex";
import Button from "../../components/control/Button";

const IMG_VPAD = 15;
const IMG_HPAD_RATIO = 1/5;

export interface IStickerCardProps {
    sticker : ISticker;
    cardSize: number;
}

export default function StickerCard({sticker, cardSize}: IStickerCardProps): ReactElement {
    const colors = useColors();
    const config = useConfig();

    const stickerPhysicalSize = `${sticker.physicalWidth.toFixed(2).replace(trimTrailingZerosRe, "")}" x ${sticker.physicalHeight.toFixed(2).replace(trimTrailingZerosRe, "")}";`

    return <div style={{width: cardSize, display: "flex", flexDirection: "column"}}>
        <img src={sticker.designPath} style={{backgroundColor: colors.neutralPalatte.Lightest(), borderTopLeftRadius: config.borderRadius, borderTopRightRadius: config.borderRadius, padding: `${IMG_VPAD}px ${Math.round((cardSize - IMG_VPAD) * IMG_HPAD_RATIO) + IMG_VPAD}px`}}/>
        
        <div style={{padding: 10, borderColor: colors.neutralPalatte.Lightest(), borderStyle: "solid", borderWidth: 1, borderBottomLeftRadius: config.borderRadius, borderBottomRightRadius: config.borderRadius}}>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 2.5}}>
                <div style={{flex: 1}}>
                    {sticker.name}
                </div>

                <Button size="none" style={{padding: 5}}>
                    <FontAwesomeIcon icon={faEllipsis}/>
                </Button>
            </div>

            <div style={{fontSize: "0.75em", color: colors.neutralPalatte.Darkest()}}>
                {sticker.description}
                <div style={{height: 2.5}}/>
                {stickerPhysicalSize}
            </div>
        </div>
    </div>
}