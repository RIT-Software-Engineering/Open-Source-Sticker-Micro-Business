import { useCallback, useState, type ReactElement } from "react";
import Catalog from "./catalog/Catalog";
import useText from "../modules/Text";
import { type ISticker } from "../modules/data/Sticker";
import StagingArea from "./StagingArea";
import type IStagedItem from "../modules/data/StagedItem";

export default function Store(): ReactElement {
    const text = useText();

    const [staged, setStaged] = useState<IStagedItem[]>([]);

    const OnAddSticker = useCallback((sticker: ISticker, quantity: number = 1) => {
        let found: boolean = false;
        for(const item of staged) {
            if(item.sticker.id == sticker.id) {
                item.quantity += quantity;
                found = true;
                break;
            }
        }

        if(!found) {
            staged.push({sticker, quantity});
        }

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