import { useEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import type { Callback } from "../../Types";
import { useColors } from "../../modules/Colors";

function DefineStyle(radius: number, hpad: number, vpad: number, fontSize: number): Readonly<{borderRadius: number, padding: string, fontSize: string}> {
    return Object.freeze({
        borderRadius: radius,
        padding: `${hpad / 2}px ${vpad / 2}px`,
        fontSize: `${fontSize}em`,
    });
}

const SIZE_DEFINITION = {
    "large"     : DefineStyle(4, 32, 20, 1.25 ),
    "medium"    : DefineStyle(4, 32, 16, 1    ),
    "small"     : DefineStyle(4, 24, 12, 0.875),
    "extraSmall": DefineStyle(4, 24,  8, 0.875)
}

export interface IButtonProps {
    onClick? : Callback      | undefined;
    children?: ReactNode     | undefined;
    color    : Exclude<CSSProperties["color"], undefined>;
    outline? : boolean       | undefined;
    style?   : CSSProperties | undefined;
    size?    : keyof typeof SIZE_DEFINITION | undefined;
    disabled?: boolean       | undefined
}

export default function Button({onClick, color: colorProp, outline, size, children, style, disabled}: IButtonProps): ReactElement {
    const [state, setState] = useState<"inactive" | "hovered" | "downInside" | "downOutside">("inactive");
    
    const colors = useColors();

    const def = SIZE_DEFINITION[size ?? "medium"] ?? SIZE_DEFINITION["medium"];

    const OnClickStart = () => {
        if(disabled) return;

        setState("downInside");
    }

    const OnClickEnd = () => {
        if(disabled) return;

        if(state == "downOutside") {
            setState("inactive");
        } else {
            setState("hovered");
        }

        if(onClick != null) onClick();
    }

    const OnEnter = () => {
        if(disabled) return;

        if(state == "inactive") {
            setState("hovered");
        } else if(state == "downOutside") {
            setState("downInside");
        }
    }

    const OnLeave = () => {
        if(disabled) return;

        if(state == "hovered") {
            setState("inactive");
        } else if(state == "downInside") {
            setState("downOutside");
        }
    }

    const stateObject = useRef<typeof state>(state);
    stateObject.current = state;
    useEffect(() => {
        const handler = () => {
            if(disabled) return;

            if(stateObject.current == "downOutside") {
                setState("inactive");
            }
        }

        document.addEventListener("mouseup", handler);

        return () => {
            document.removeEventListener("mouseup", handler);
        }
    }, []);

    let color: CSSProperties["color"] = colorProp;
    if(disabled) {
        color = colors.neutralPalatte.Dark(colors.neutralPalatte.Lightest());
    } else {
        const palatte = colors.FindPalatte(color);
        if(colors.neutralPalatte.Has(color)) {
            switch(state) {
                case "downInside":
                case "downOutside":
                    color = palatte.Darkest(color);
                    break;
                case "hovered":
                    color = palatte.Darker(color);
                    break;
            }
        }
    }

    return <button
        onMouseDown={OnClickStart}
        onMouseUp={OnClickEnd}
        onMouseEnter={OnEnter}
        onMouseLeave={OnLeave}
        children={children}
        style={{...def, borderWidth: 5, backgroundColor: outline ? "#00000000" : color, color: outline ? color : colors.TextColor(color), borderColor: outline ? color : "#00000000", ...(style ?? {})}}
    />
}