import type { CSSProperties, ReactElement, ReactNode } from "react";
import type { Callback } from "../../Types";

export interface IButtonProps {
    onClick? : Callback      | undefined;
    children?: ReactNode     | undefined;
    color?   : string        | undefined;
    outline? : boolean       | undefined;
    style?   : CSSProperties | undefined;
}

export default function Button({onClick, color, outline, children, style}: IButtonProps): ReactElement {
    return <button onClick={onClick} style={{backgroundColor: outline ? undefined : color, borderStyle: outline || color == null ? "solid" : "none", borderColor: outline != true && color == null ? "black" : outline ? color : undefined, borderWidth: 2.5, padding: "5px 10px", borderRadius: 10, ...(style ?? {})}}>{children}</button>
}