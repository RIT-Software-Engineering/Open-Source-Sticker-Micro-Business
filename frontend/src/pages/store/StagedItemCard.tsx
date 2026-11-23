import "./StagedItemCard.css";
import { useCallback, useEffect, useRef, type ReactElement } from "react";
import type IStagedItem from "../../modules/data/StagedItem";
import { useColors } from "../../modules/Colors";
import Button from "../../components/control/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input, { type IInputRef } from "../../components/control/Input";
import type { StateRef } from "../../Types";

export interface IStagedItemCardProps {
    /** The item that is staged */
    item: IStagedItem;
    /** What to do when the item quantity is updated */
    onUpdateItemQuantity: (id: number, quantity: number) => unknown;
    /** WHat to do when the item is removed */
    onRemoveItem: StateRef<number>
}

/**
 * A small card that displays a staged sticker
 */
export default function StagedItemCard({item, onRemoveItem, onUpdateItemQuantity}: IStagedItemCardProps): ReactElement {
    const colors = useColors();

    /** The ref for the input element */
    const inputRef = useRef<IInputRef | null>(null);

    /**
     * Cleanly update the item's quantity
     */
    const OnUpdateItemQuantity = useCallback((value: number) => {
        if(!Number.isInteger(value)) return;

        if(value <= 0) {
            onRemoveItem(item.sticker.id);
        } else {
            onUpdateItemQuantity(item.sticker.id, value);
            inputRef.current?.SetValue(value.toString());
        }
    }, [onUpdateItemQuantity, onRemoveItem, inputRef, item]);

    /**
     * If the item's quantity is updated externally, propagate the changes down
     */
    useEffect(() => {
        inputRef.current?.SetValue(item.quantity.toString());
    }, [item.quantity]);

    return <div className="staged-item-card-container" style={{backgroundColor: colors.primaryPalatte.Light(colors.primaryPalatte.Light())}}>
        <div className="staged-item-card-sticker-container">
            <img src={item.sticker.designPath} className="staged-item-card-image"/>
            {item.sticker.name}
        </div>

        <div className="staged-item-card-control-container">
            <div className="staged-item-card-quantity">
                <Button className="staged-item-card-quantity-minus" color={colors.primary} size="tiny" onClick={() => OnUpdateItemQuantity(item.quantity - 1)}>
                    <FontAwesomeIcon icon={faMinus}/>
                </Button>

                <Input
                    className="staged-item-card-quantity-input"
                    color={colors.primary}
                    size="tiny"
                    min={0}
                    pattern="\d*"
                    name={`staged-item-card-quantity-${item.sticker.id}`}
                    onEnter={(value: string) => OnUpdateItemQuantity(Number.parseInt(value))}
                    defaultValue={item.quantity.toString()}
                    ref={inputRef}
                    type="number"
                />

                <Button className="staged-item-card-quantity-add"   color={colors.primary} size="tiny" onClick={() => OnUpdateItemQuantity(item.quantity + 1)}>
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </div>

            <Button color={colors.error} size="tiny" onClick={() => onRemoveItem(item.sticker.id)}>
                <FontAwesomeIcon icon={faTrash}/>
            </Button>
        </div>
    </div>
}