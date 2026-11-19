import "./Button.css";
import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent, type ReactElement } from "react";
import type { Callback } from "../../Types";
import { useRerender } from "../../modules/Utility";
import type { ISupportsChildren, ISupportsStyle } from "../../modules/Types";
import { useControllableColor, type EControlableSize, type IControllableFlags as IControllableFlags, type IControllableState } from "./Controllable";
import Disabled from "./Disabled";

/** Base customized button props */
type _ICustomButtonProps = {
    /** What to do when the button is clicked */
    onClick?    : Callback           | undefined;
    /** The color of the button */
    color?      : CSSProperties["color"];
    /** The size of the button (default medium) */
    size?       : EControlableSize   | undefined;
    /** The value of the button if it is controlled */
    value?      : IControllableState | undefined;
} & ISupportsStyle & ISupportsChildren & IControllableFlags;

/** Props for the button component */
export type IButtonProps = 
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof _ICustomButtonProps> &
    _ICustomButtonProps;

/** A wrapped button component */
export default function Button(props: IButtonProps): ReactElement {
    const {className: classNameProp, onClick, value, color, inverted, size, children, style, disabled, silent} = props;
    props = {...props};
    delete props.inverted;
    delete props.silent;

    const rerender = useRerender("Button");
    const state = useRef<IControllableState>({active: false, inside: false});

    // Handle when the button is controlled
    const controlLog = useRef<IControllableState>(value);
    if(controlLog.current != value) {
        state.current.active = false;
        controlLog.current = value;
    }

    const controlled = value != undefined;
    if(value != null) state.current = value;

    /**
     * Updates the state of the button, call this instead of setting .current directly
     * @param value The state of the button
     */
    const UpdateState = (value: Partial<IControllableState>) => {
        if(controlled) return;
        if(state.current.active == value.active && state.current.inside == value.inside) return;

        if(value.active != null) state.current.active = value.active;
        if(value.inside != null) state.current.inside = value.inside;

        rerender(JSON.stringify(state));
    }

    /**
     * Runs when a click is started  
     * Sets the state to down (inside)
     */
    const OnClickStart = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(disabled) return;

        if(props.onMouseDown != null) props.onMouseDown(event);

        UpdateState({active: true});
    }

    /**
     * Runs when a click is ended on the element  
     * Sets the state to:
     *  * Inactive if the click ended off the element
     *  * Hovered if the click ended on the element
     */
    const OnClickEnd = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if(disabled) return;

        const canPress = state.current.active && state.current.inside;

        if(props.onMouseUp != null) props.onMouseUp(event);

        UpdateState({active: false});

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

        UpdateState({inside: true});
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

        UpdateState({inside: false});
    }

    /**
     * Sets an outside click end handler for when a click is cancelled (the mouse is released outside the element)
     * Sets the state to inactive if the mouse is being held and is outside of the element
     */
    useEffect(() => {
        const handler = () => {
            if(disabled) return;

            if(state.current.active && !state.current.inside) {
                UpdateState({active: false});
            }
        }

        document.addEventListener("mouseup", handler);

        return () => {
            document.removeEventListener("mouseup", handler);
        }
    }, []);

    const {shade, text, back} = useControllableColor(
        color,
        state.current,
        {silent, disabled, inverted: !inverted}
    );

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
        style={{backgroundColor: back ?? "#00000000", color: text, borderColor: inverted ? color : "#00000000", ...(style ?? {}), position: "relative"}} // Position should always be overriden
        className={className}
    >
        <Disabled shade={shade}/>
        {children}
    </button>
}