import "./StickerCard.css";
import type { ReactElement } from "react";
import type { ISticker } from "../../modules/data/Sticker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useColors } from "../../modules/Colors";
import { trimDecimalRe } from "../../modules/Regex";
import Button from "../../components/control/Button";
import useText from "../../modules/Text";

export interface IStickerCardProps {
    /** The sticker to display on the card */
    sticker      : ISticker;
    /** What to do when a sticker is added, does not display an add sticker button if not passed */
    onAddSticker?: ((sticker: ISticker, quantity?: number) => unknown) | undefined;
}

/**
 * A small card displaying a sticker
 */
export default function StickerCard({sticker, onAddSticker}: IStickerCardProps): ReactElement {
    const text = useText();
    const colors = useColors();

    const stickerPhysicalSize = `${sticker.physicalWidth.toFixed(2).replace(trimDecimalRe, "")}" x ${sticker.physicalHeight.toFixed(2).replace(trimDecimalRe, "")}"`;

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

            {onAddSticker != null
                ? <div className="sticker-card-add-container">
                    <Button color={colors.primary} size="small" className="sticker-card-add" onClick={() => onAddSticker(sticker, 1)}>
                        <FontAwesomeIcon icon={faPlus} className="sticker-card-add-icon"/>
                        {text.store.add}
                    </Button>
                </div> : <></>
            }
        </div>
    </div>
}