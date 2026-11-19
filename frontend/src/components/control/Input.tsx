import "./Input.css";
import { useCallback, useRef, type CSSProperties, type FocusEvent, type InputHTMLAttributes, type ReactElement } from "react";
import type { ISupportsStyle } from "../../modules/Types";
import { useColors } from "../../modules/Colors";
import { useControllableColor, type EControlableSize, type IControllableFlags, type IControllableState } from "./Controllable";
import { useRerender } from "../../modules/Utility";
import Disabled from "./Disabled";

/** Base customized input props */
type _ICustomInputProps = {
    /** The color of the button */
    color?      : CSSProperties["color"];
    /** The size of the button (default medium) */
    size?       : EControlableSize | undefined;
} & ISupportsStyle & IControllableFlags;

/** Props for the input component */
export type IInputProps = 
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof _ICustomInputProps> &
    _ICustomInputProps;

export default function Input(props: IInputProps): ReactElement {
    const {style, onFocus, onBlur, color, size, className: classNameProp, inverted, disabled, silent} = props;
    props = {...props};
    delete props.size;

    const colors = useColors();
    const rerender = useRerender("Input");

    const state = useRef<IControllableState>({active: props.autoFocus ?? false, inside: false});

    const SetState = useCallback((value: Partial<IControllableState>) => {
        if(state.current.active == value.active && state.current.inside == value.inside) return;
        
        if(value.active != null) state.current.active = value.active;
        if(value.inside != null) state.current.inside = value.inside;

        rerender(JSON.stringify(state));
    }, []);

    const OnFocus = useCallback((event: FocusEvent<HTMLInputElement, Element>) => {
        SetState({active: true});

        if(onFocus) onFocus(event);
    }, []);

    const OnBlur = useCallback((event: FocusEvent<HTMLInputElement, Element>) => {
        SetState({active: false});

        if(onBlur) onBlur(event);
    }, []);

    const {shade, back} = useControllableColor(color, state.current, {silent, disabled, inverted});

    let className = (size ?? "medium") + "-generic-input generic-input";
    if(classNameProp != null) {
        className += " " + classNameProp;
    }

    return <input
        {...props}
        size={undefined}
        onFocus={OnFocus}
        onBlur={OnBlur}
        className={className}
        style={{borderColor: back ?? colors.neutralPalatte.Lighter(), backgroundColor: shade, ...(style ?? {})}}
    />
}