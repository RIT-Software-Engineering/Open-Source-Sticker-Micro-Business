import type { ReactElement } from "react";
import { useColors } from "../../modules/context/Colors";

export default function Temp({name}: {name: string}): ReactElement {
    const colors = useColors();

    return <div style={{display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, flex: 1}}>
        {name}
    </div>
}