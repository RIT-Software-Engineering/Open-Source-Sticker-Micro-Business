import { useCallback, type ReactElement } from "react";
import Catalog from "./catalog/Catalog";
import useText from "../modules/Text";
import { GetExampleSticker, type ISticker } from "../modules/data/Sticker";
import StagingArea from "./StagingArea";
import type IStagedItem from "../modules/data/StagedItem";

export default function Store(): ReactElement {
    const text = useText();

    const staged: IStagedItem[] = [{
        item: GetExampleSticker(),
        quantity: 2
    }];

    const OnAddSticker = useCallback((sticker: ISticker) => {

    }, []);

    return <>
        <Catalog
            live={true}
            title={text.store.title}
            desc={text.store.desc}
            onAddSticker={OnAddSticker}
        />
        <StagingArea
            staged={staged}
        />
    </>
}