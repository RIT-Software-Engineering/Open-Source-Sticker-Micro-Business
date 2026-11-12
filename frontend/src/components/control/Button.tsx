import "./Button.css";
import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent, type ReactElement } from "react";
import type { Callback } from "../../Types";
import { useColors } from "../../modules/Colors";
import { useRerender } from "../../modules/Utility";
import type { ISupportsChildren, ISupportsStyle } from "../../modules/Types";

/** States that the button can be in (the actual granular states) */
type IInternalButtonState = "inactive" | "hovered" | "downInside" | "downOutside";
/** States that the button can be in */
export type IButtonState  = "hovered" | "down";
/** Styling types of the button */
export type IButtonType   = "outline" | "solid" | "invisible";
/** Available sizes of the button */
export type IButtonSize   = "large" | "medium" | "small" | "tiny" | "none";

/** Base customized button props */
type _ICustomButtonProps = {
    /** What to do when the button is clicked */
    onClick?    : Callback      | undefined;
    /** The color of the button */
    color?      : CSSProperties["color"];
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
} & ISupportsStyle & ISupportsChildren;

/** Props for the button component */
export type IButtonProps = 
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof _ICustomButtonProps> &
    _ICustomButtonProps;

/** A wrapped button component */
export default function Button(props: IButtonProps): ReactElement {
    const {className: classNameProp, onClick, value, color: colorProp, darkOnLight, size, children, style, disabled, silent} = props;

    const rerender = useRerender("Button");
    const state = useRef<IInternalButtonState>("inactive");

    const colors = useColors();

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
                        back = palatte.Dark(palatte.Dark(color));
                        break;
                    case "hovered":
                        back = palatte.Dark(color);
                        break;
                    default:
                        back = color;
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

    let className = (size ?? "medium") + "-generic-button generic-button";
    if(classNameProp != null) {
        className += " " + classNameProp;
    }

    return <button
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        onMouseDown={OnClickStart}
        onMouseUp={OnClickEnd}
        onMouseEnter={OnEnter}
        onMouseLeave={OnLeave}
        onClick={() => {}} // On click is handled manually
        style={{backgroundColor: back ?? "#00000000", color: text, borderColor: darkOnLight ? color : "#00000000", ...(style ?? {}), position: "relative"}} // Position should always be overriden
        className={className}
    >
        <div className="generic-button-overlay" style={{backgroundColor: shade}}/>
        {children}
    </button>
}