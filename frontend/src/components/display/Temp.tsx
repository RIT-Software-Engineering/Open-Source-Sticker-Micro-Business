import type { ReactElement } from "react";
import { useColors } from "../../modules/Colors";

export default function Temp({name}: {name: string}): ReactElement {
    const colors = useColors();

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.neutralPalatte.Lighter(colors.neutral), flex: 1}}>
        {name}
    </div>
}