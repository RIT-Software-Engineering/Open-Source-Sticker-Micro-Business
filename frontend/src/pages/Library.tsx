import type { ReactElement } from "react";
import Catalog from "./catalog/Catalog";
import useText from "../modules/Text";

/**
 * The library page  
 * Inherits the catalog
 */
export default function Library(): ReactElement {
    const text = useText();

    return <Catalog
        live={false}
        title={text.library.title}
        desc={text.library.desc}
    />
}