import { useCallback, type ReactElement } from "react";
import Catalog from "./catalog/Catalog";
import useText from "../modules/Text";
import type { ISticker } from "../modules/data/Sticker";
import StagingArea from "./StagingArea";

export default function Store(): ReactElement {
    const text = useText();

    const OnAddSticker = useCallback((sticker: ISticker) => {

    }, []);

    return <>
        <Catalog
            live={true}
            title={text.store.title}
            desc={text.store.desc}
            onAddSticker={OnAddSticker}
        />
        <StagingArea/>
    </>
}