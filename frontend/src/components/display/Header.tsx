import type { ReactElement } from "react";
import { useColors } from "../../modules/Colors";

export default function Header({name}: {name: string}): ReactElement {
    const colors = useColors();

    return <p style={{padding: 2.5, borderStyle: "solid", borderWidth: 1, borderColor: colors.neutral}}>{name}</p>
}