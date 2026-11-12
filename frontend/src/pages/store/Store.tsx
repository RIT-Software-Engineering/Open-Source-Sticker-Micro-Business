import type { ReactElement } from "react";
import useText from "../../modules/Text";
import { useColors } from "../../modules/Colors";
import Search from "../../components/control/Search";

export default function Store(): ReactElement {
    const text = useText();
    const colors = useColors();

    return <div style={{padding: 5, flex: 1, overflowY: "visible"}}>
        <div style={{display: "flex", flexDirection: "row", flex: 1, marginBottom: 15}}>
            <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                <h2>{text.store.title}</h2>
                <div style={{maxWidth: 500, color: colors.neutralPalatte.Darkest()}}>{text.store.desc}</div>
            </div>
        </div>

        <Search/>
    </div>
}