import "./StickerCard.css";
import type { ReactElement } from "react";
import type { ISticker } from "../../../modules/data/Sticker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useColors } from "../../../modules/Colors";
import { trimTrailingZerosRe } from "../../../modules/Regex";
import Button from "../../../components/control/Button";

export interface IStickerCardProps {
    /** The sticker to display on the card */
    sticker : ISticker;
}

/**
 * A small card displaying a sticker
 */
export default function StickerCard({sticker}: IStickerCardProps): ReactElement {
    const colors = useColors();

    const stickerPhysicalSize = `${sticker.physicalWidth.toFixed(2).replace(trimTrailingZerosRe, "")}" x ${sticker.physicalHeight.toFixed(2).replace(trimTrailingZerosRe, "")}"`;

    return <div className="sticker-card-container">
        <img src={sticker.designPath} className="sticker-card-image" style={{backgroundColor: colors.neutralPalatte.Lightest()}}/>
        
        <div className="sticker-card-body" style={{borderColor: colors.neutralPalatte.Lightest()}}>
            <div className="sticker-card-body-header">
                <div className="sticker-card-title">
                    {sticker.name}
                </div>

                <Button size="none" className="sticker-card-control">
                    <FontAwesomeIcon icon={faEllipsis}/>
                </Button>
            </div>

            <div className="sticker-card-description" style={{color: colors.neutralPalatte.Darkest()}}>
                {sticker.description}
                <div style={{height: 2.5}}/>
                {stickerPhysicalSize}
            </div>
        </div>
    </div>
}