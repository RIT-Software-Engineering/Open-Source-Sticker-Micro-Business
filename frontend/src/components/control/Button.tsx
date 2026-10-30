import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent, type ReactElement, type ReactNode } from "react";
import type { Callback } from "../../Types";
import { useColors } from "../../modules/Colors";
import { useRerender } from "../../modules/Utility";

/** The width for the border of the button */
const BORDER_WIDTH = 5;

/**
 * Style definition helper function
 */
function DefineStyle(radius: number, hpad: number, vpad: number, fontSize: number): Readonly<{borderRadius: number, padding: string, fontSize: string}> {
    return Object.freeze({
        borderRadius: radius,
        padding: `${hpad / 2}px ${vpad / 2}px`,
        fontSize: `${fontSize}em`,
    });
}

/**
 * Size detail enumeration
 */
const SIZE_DEFINITION = {
    "large"     : DefineStyle(4, 32, 20, 1.25 ),
    "medium"    : DefineStyle(4, 32, 16, 1    ),
    "small"     : DefineStyle(4, 24, 12, 0.875),
    "extraSmall": DefineStyle(4, 24,  8, 0.875)
}

/** Base customized button props */
type _ICustomButtonProps = {
    /** What to do when the button is clicked */
    onClick? : Callback      | undefined;
    children?: ReactNode     | undefined;
    /** The color of the button */
    color?    : CSSProperties["color"];
    /** Is the button outlined? */
    outline? : boolean       | undefined;
    /** Note that you cannot override `position` */
    style?   : CSSProperties | undefined;
    /** The size of the button (default medium) */
    size?    : keyof typeof SIZE_DEFINITION | undefined;
    /** Is the button disabled */
    disabled?: boolean       | undefined;
    /** Does the button not react */
    silent?  : boolean       | undefined;
    value?   : "hovered" | "down" | undefined;
}

/** Props for the button component */
export type IButtonProps = 
    Exclude<ButtonHTMLAttributes<HTMLButtonElement>, keyof _ICustomButtonProps> &
    _ICustomButtonProps;

/** A wrapped button component */
export default function Button(props: IButtonProps): ReactElement {
    const {onClick, value, color: colorProp, outline, size, children, style, disabled, silent} = props;

    const rerender = useRerender("Button");
    const state = useRef<"inactive" | "hovered" | "downInside" | "downOutside">("inactive");

    const colors = useColors();
    const def = SIZE_DEFINITION[size ?? "medium"] ?? SIZE_DEFINITION["medium"];

    // Handle when the button is controlled
    const controlLog = useRef<IButtonProps["value"]>(value);
    if(controlLog.current != value) {
        state.current = "inactive";
        controlLog.current = value;
    }

    const controlled = value != undefined;
    if(value == "down") {
        switch(state.current) {
            case "inactive":
                state.current = "downOutside";
                break;
            case "hovered":
                state.current = "downInside";
                break;
        }
    } else if(value == "hovered") {
        state.current = "hovered";
    }

    /**
     * Updates the state of the button, call this instead of setting .current directly
     * @param value The state of the button
     */
    const UpdateState = (value: typeof state["current"]) => {
        if(controlled) return;

        state.current = value;
        rerender(value);
    }

    /**
     * Runs when a click is started  
     * Sets the state to down (inside)
     */
    const OnClickStart = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(disabled) return;

        if(props.onMouseDown != null) props.onMouseDown(event);

        UpdateState("downInside");
    }

    /**
     * Runs when a click is ended on the element  
     * Sets the state to:
     *  * Inactive if the click ended off the element
     *  * Hovered if the click ended on the element
     */
    const OnClickEnd = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(disabled) return;

        if(props.onMouseUp != null) props.onMouseUp(event);

        if(state.current == "downOutside") {
            UpdateState("inactive");
        } else {
            UpdateState("hovered");
        }

        if(onClick != null) onClick();
    }

    /**
     * Runs when the mouse enters the element
     * Sets the state to:
     *  * Hovered if the mouse is not held
     *  * Down (inside) if the mouse is held
     */
    const OnEnter = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(disabled) return;

        if(props.onMouseEnter != null) props.onMouseEnter(event);

        if(state.current == "inactive") {
            UpdateState("hovered");
        } else if(state.current == "downOutside") {
            UpdateState("downInside");
        } rerender
    }

    /**
     * Runs when the mouse leaves the element
     * Sets the state to:
     *  * Inactive if the mouse is not held
     *  * Down (outside) if the mouse is held
     */
    const OnLeave = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(disabled) return;

        if(props.onMouseLeave != null) props.onMouseLeave(event);

        if(state.current == "hovered") {
            UpdateState("inactive");
        } else if(state.current == "downInside") {
            UpdateState("downOutside");
        }
    }

    /**
     * Sets an outside click end handler for when a click is cancelled (the mouse is released outside the element)
     * Sets the state to inactive if the mouse is being held and is outside of the element
     */
    useEffect(() => {
        const handler = () => {
            if(disabled) return;

            if(state.current == "downOutside") {
                UpdateState("inactive");
            }
        }

        document.addEventListener("mouseup", handler);

        return () => {
            document.removeEventListener("mouseup", handler);
        }
    }, []);

    /** The background color of the element if the element has palattized color */
    let color: CSSProperties["color"] = colorProp;
    if(color != null && !silent) {
        if(disabled) {
            // If the button is disabled, set the color to disabled
            color = colors.neutralPalatte.Dark(colors.neutralPalatte.Lightest());
        } else {
            const palatte = colors.FindPalatte(color);
            if(palatte != colors.neutralPalatte || colors.neutralPalatte.Has(color)) {
                switch(state.current) {
                    case "downInside":
                    case "downOutside":
                        // If the button is held, make it really dark
                        color = palatte.Darkest(color);
                        break;
                    case "hovered":
                        // If the button is hovered, make it darker
                        color = palatte.Darker(color);
                        break;
                }
            }
        }
    }

    /** The shading of the element if the specific color can't be calculated */
    let shadeColor: CSSProperties["color"] = undefined;
    if(color == null && !silent) {
        if(disabled) {
            // If the button is disabled, set the color to disabled
            shadeColor = "#80808060"
        } else {
            switch(state.current) {
                case "downInside":
                case "downOutside":
                    // If the button is held, make it really dark
                    shadeColor = "#80808080";
                    break;
                case "hovered":
                    // If the button is hovered, make it darker
                    shadeColor = "#80808050";
            }
        }
    }

    /** The text color of the element */
    let textColor = undefined;
    if(color == null) {
        // If don't know the color, don't know the text color
        textColor = undefined;
    } else if(outline) {
        // If the button is outlined, the text color should be the same as the border color
        textColor = color;
    } else {
        // Otherwise, the text color should contrast with the button's color
        textColor = colors.TextColor(color);
    }

    return <button
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        onMouseDown={OnClickStart}
        onMouseUp={OnClickEnd}
        onMouseEnter={OnEnter}
        onMouseLeave={OnLeave}
        onClick={() => {}} // On click is handled manually
        style={{...def, borderWidth: BORDER_WIDTH, backgroundColor: outline ? "#00000000" : color, color: textColor, borderColor: outline ? color : "#00000000", cursor: "pointer", ...(style ?? {}), position: "relative"}}
    >
        <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: shadeColor, margin: -BORDER_WIDTH, borderRadius: def.borderRadius}}/>
        {children}
    </button>
}