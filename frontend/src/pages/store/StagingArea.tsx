import "./StagingArea.css";
import { useCallback, type ReactElement } from "react";
import useText, { GetPlural, TemplateText } from "../../modules/Text";
import { useColors } from "../../modules/Colors";
import StagedItemCard from "./StagedItemCard";
import type IStagedItem from "../../modules/data/StagedItem";
import type { StateRef } from "../../Types";
import Button from "../../components/control/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export interface IStagingAreaProps {
    /** The staged items */
    staged: IStagedItem[];
    /** Set the staged items */
    setStaged: StateRef<IStagedItem[]>;
}

/**
 * The store's staging area
 * @param param0 
 * @returns 
 */
export default function StagingArea({staged, setStaged}: IStagingAreaProps): ReactElement {
    const text = useText();
    const colors = useColors();

    /**
     * What to do when an item in the staging area's quantity is updated  
     * 
     * @param id The id of the item to update
     * @param quantity The quantity to set to the item, non-positive numbers remove the item
     */
    const OnUpdateItemQuantity = useCallback((id: number, quantity: number) => {
        const item = staged.find(item => item.sticker.id == id);
        if(item == null) return;
        item.quantity = quantity;
        setStaged([...staged]);
    }, [staged]);

    /**
     * What to do when an item is removed from the staging area
     * 
     * @param id The id of the item to remove
     */
    const OnRemoveItem = useCallback((id: number) => {
        setStaged(staged.filter(item => item.sticker.id != id));
    }, [staged]);

    /**
     * What to do when a sheet is build
     */
    const OnBuildSheet = useCallback(() => {

    }, []);

    return <div className="staging-area-container">
        <div className="staging-area-header">
            <h3>{text.store.stagingArea.title}</h3>
            <div className="staging-area-summary" style={{color: colors.neutralPalatte.Dark()}}>
                {staged.length == 0
                    ? text.store.stagingArea.empty
                    : TemplateText(text.store.stagingArea.ready, staged.length.toString(), GetPlural(staged.length))
                }
            </div>
        </div>

        <div className="staging-area scrollable">
            {staged.map(value => <StagedItemCard
                key={value.sticker.id}
                item={value}
                onRemoveItem={OnRemoveItem}
                onUpdateItemQuantity={OnUpdateItemQuantity}
            />)}
        </div>

        <div className="staging-area-footer">
            <Button color={colors.primary} className="staging-area-build" onClick={OnBuildSheet}>
                {text.store.stagingArea.build}
                <FontAwesomeIcon icon={faArrowRight}/>
            </Button>
        </div>
    </div>
}