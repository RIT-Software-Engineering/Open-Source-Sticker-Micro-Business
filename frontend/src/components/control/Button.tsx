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
const SIZE_DEFINITION = Object.freeze({
    "large"     : DefineStyle(4, 32, 20, 1.25 ),
    "medium"    : DefineStyle(4, 32, 16, 1    ),
    "small"     : DefineStyle(4, 24, 12, 0.875),
    "extraSmall": DefineStyle(4, 24,  8, 0.875)
})

/** States that the button can be in (the actual granular states) */
type IInternalButtonState = "inactive" | "hovered" | "downInside" | "downOutside";
/** States that the button can be in */
export type IButtonState  = "hovered" | "down";
/** Styling types of the button */
export type IButtonType   = "outline" | "solid" | "invisible";
/** Available sizes of the button */
export type IButtonSize   = keyof typeof SIZE_DEFINITION;

/** Base customized button props */
type _ICustomButtonProps = {
    children?   : ReactNode     | undefined;
    /** What to do when the button is clicked */
    onClick?    : Callback      | undefined;
    /** The color of the button */
    color?      : CSSProperties["color"];
    /** Note that you cannot override `position` */
    style?      : CSSProperties | undefined;
    /** The size of the button (default medium) */
    size?       : IButtonSize   | undefined;
    /** Is the button disabled */
    disabled?   : boolean       | undefined;
    /** Does the button not react */
    silent?     : boolean       | undefined;
    /** The value of the button if it is controlled */
    value?      : IButtonState  | undefined;
    /** Is the button dark text on a light background (default false) */
    darkOnLight?: boolean       | undefined
}

/** Props for the button component */
export type IButtonProps = 
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof _ICustomButtonProps> &
    _ICustomButtonProps;

/** A wrapped button component */
export default function Button(props: IButtonProps): ReactElement {
    const {onClick, value, color: colorProp, darkOnLight, size, children, style, disabled, silent} = props;

    const rerender = useRerender("Button");
    const state = useRef<IInternalButtonState>("inactive");

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

        const canPress = state.current == "downInside";

        if(props.onMouseUp != null) props.onMouseUp(event);

        if(state.current == "downOutside") {
            UpdateState("inactive");
        } else {
            UpdateState("hovered");
        }

        if(canPress) {
            if(onClick != null) onClick();
        }
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
        }
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

    // Determine the color of the button
    /** The root color of the button */
    let color: CSSProperties["color"] = colorProp;
    /** The shading color of the button (overlay) */
    let shade: CSSProperties["color"] = undefined;
    /** The text color of the button */
    let text : CSSProperties["color"] = undefined;
    /** The background color of the button */
    let back : CSSProperties["color"] = undefined;
    /** The palatte that the button is using */
    const palatte = color == null ? colors.neutralPalatte : colors.FindPalatte(color);
    const buttonColorState: IInternalButtonState = silent ? "inactive" : state.current;
    if(color != null && palatte.Has(color)) {
        // Palatte color
        if(disabled) {
            back = colors.neutralPalatte.Dark(colors.neutralPalatte.Lightest());
            text = colors.TextColor(back);
        } else {
            if(darkOnLight) {
                // Text color is primary
                switch(buttonColorState) {
                    case "downInside":
                    case "downOutside":
                        back = color;
                        text = colors.TextColor(back);
                        break;
                    case "hovered":
                        back = palatte.Light(color);
                        text = color;
                        break;
                    default:
                        text = color;
                        break;
                }
            } else {
                // Background color is primary
                switch(buttonColorState) {
                    case "downInside":
                    case "downOutside":
                        back = palatte.Dark(color);
                        break;
                    case "hovered":
                        back = color;
                        break;
                    default:
                        back = palatte.Light(color);
                        break;
                }

                text = colors.TextColor(back);
            }
        }
    } else {
        // No color or non-palatte color
        if(disabled) {
            // If the button is disabled, set the color to disabled
            shade = "#80808060"
        } else {
            switch(buttonColorState) {
                case "downInside":
                case "downOutside":
                    // If the button is held, make it really dark
                    shade = "#80808080";
                    break;
                case "hovered":
                    // If the button is hovered, make it darker
                    shade = "#80808050";
                    break;
            }
        }
    }

    return <button
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        onMouseDown={OnClickStart}
        onMouseUp={OnClickEnd}
        onMouseEnter={OnEnter}
        onMouseLeave={OnLeave}
        onClick={() => {}} // On click is handled manually
        style={{...def, borderWidth: 0, backgroundColor: back ?? "#00000000", color: text, borderColor: darkOnLight ? color : "#00000000", cursor: "pointer", ...(style ?? {}), position: "relative"}}
    >
        <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: shade, margin: -BORDER_WIDTH, borderRadius: def.borderRadius}}/>
        {children}
    </button>
}