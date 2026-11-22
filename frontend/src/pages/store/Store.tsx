import { useCallback, useState, type ReactElement } from "react";
import Catalog from "../catalog/Catalog";
import useText from "../../modules/Text";
import { type ISticker } from "../../modules/data/Sticker";
import StagingArea from "./StagingArea";
import type IStagedItem from "../../modules/data/StagedItem";

/**
 * The store page  
 * Inherits the catalog
 */
export default function Store(): ReactElement {
    const text = useText();

    /** The staged items (STUBBED) */
    const [staged, setStaged] = useState<IStagedItem[]>([]);

    /**
     * What to do when a sticker is added
     */
    const OnAddSticker = useCallback((sticker: ISticker, quantity: number = 1) => {
        // Search to see if that sticker already exists, add it if so
        let found: boolean = false;
        for(const item of staged) {
            if(item.sticker.id == sticker.id) {
                item.quantity += quantity;
                found = true;
                break;
            }
        }

        // If the sticker doesn't exist, add it
        if(!found) {
            staged.push({sticker, quantity});
        }

        // Update the state
        setStaged([...staged]);
    }, [staged, setStaged]);

    return <>
        <Catalog
            live={true}
            title={text.store.title}
            desc={text.store.desc}
            onAddSticker={OnAddSticker}
        />
        <StagingArea
            staged={staged}
            setStaged={setStaged}
        />
    </>
}