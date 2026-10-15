import type { ReactElement } from "react";
import { useColors } from "../../modules/context/Colors";

export default function Header({name}: {name: string}): ReactElement {
    const colors = useColors();

    return <p style={{padding: 2.5, borderStyle: "solid", borderWidth: 1, borderColor: colors.accent}}>{name}</p>
}