import "./StagedItemCard.css";
import type { ReactElement } from "react";
import type IStagedItem from "../modules/data/StagedItem";
import { useColors } from "../modules/Colors";
import Button from "../components/control/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "../components/control/Input";

export interface IStagedItemCardProps {
    item: IStagedItem;
}

export default function StagedItemCard({item}: IStagedItemCardProps): ReactElement {
    const colors = useColors();

    return <div className="staged-item-card-container" style={{backgroundColor: colors.primaryPalatte.Light(colors.primaryPalatte.Light())}}>
        <div className="staged-item-card-sticker-container">
            <img src={item.item.designPath} className="staged-item-card-image"/>
            {item.item.name}
        </div>

        <div className="staged-item-card-control-container">
            <div className="staged-item-card-quantity">
                <Button className="staged-item-card-quantity-minus" color={colors.primary} size="tiny">
                    <FontAwesomeIcon icon={faMinus}/>
                </Button>

                <Input  className="staged-item-card-quantity-input" color={colors.primary} size="tiny"/>

                <Button className="staged-item-card-quantity-add"   color={colors.primary} size="tiny">
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </div>

            <Button color={colors.error} size="tiny">
                <FontAwesomeIcon icon={faTrash}/>
            </Button>
        </div>
    </div>
}