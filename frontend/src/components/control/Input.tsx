import "./Input.css";
import { useCallback, useRef, type ChangeEvent, type CSSProperties, type FocusEvent, type InputHTMLAttributes, type KeyboardEvent, type ReactElement } from "react";
import type { ISupportsRef, ISupportsStyle } from "../../modules/Types";
import { useColors } from "../../modules/Colors";
import { useControllableColor, type EControlableSize, type IControllableFlags, type IControllableState } from "./Controllable";
import { BindRef, useRerender } from "../../modules/Utility";
import type { StateRef } from "../../Types";

export type IInputRef = {
    /** Set the value of the input */
    SetValue: StateRef<string>;
}

/** Base customized input props */
type _ICustomInputProps = {
    /** The color of the button when it is selected */
    color?        : CSSProperties["color"];
    /** The color of the button when it has incorrect data */
    errorColor?   : CSSProperties["color"];
    /** The color of the button when it is not selected */
    inactiveColor?: CSSProperties["color"];
    /** The size of the button (default medium) */
    size?         : EControlableSize | undefined;
    /** When the input's value is entered, pass a value to set a new value */
    onEnter?      : ((value: string) => string | null | undefined | void) | undefined;
    /** Control this component's value */
    value?        : string | undefined;
    /** The default value of the input */
    defaultValue? : string | undefined;
} & ISupportsStyle & IControllableFlags & ISupportsRef<IInputRef>;

/** Props for the input component */
export type IInputProps = 
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof _ICustomInputProps | "color"> &
    _ICustomInputProps;

export default function Input(props: IInputProps): ReactElement {
    const {ref, style, defaultValue, value: valueProp, onFocus, onBlur, onEnter, onKeyDown, color, errorColor, inactiveColor, onChange, size, className: classNameProp, inverted, disabled, silent} = props;
    props = {...props};
    delete props.size;
    delete props.onEnter;
    delete props.defaultValue;
    delete props.ref;

    const colors = useColors();
    const rerender = useRerender("Input");

    /** The controllable state of the component */
    const state = useRef<IControllableState>({active: props.autoFocus ?? false, inside: false});
    /** The error state of the component, true if there is an error */
    const error = useRef<boolean>(false);
    /** The text value of the component */
    const value = useRef<string>(defaultValue ?? "");
    if(valueProp != null && valueProp != value.current) value.current = valueProp;

    /**
     * Cleanly set the value for the component
     */
    const SetValue = useCallback((next: string) => {
        value.current = next;
        rerender("Value updated");
    }, [value, rerender]);

    /**
     * Cleanly set the state for the component  
     * Handles rerender optimization
     */
    const SetState = useCallback((value: Partial<IControllableState>) => {
        if(state.current.active == value.active && state.current.inside == value.inside) return;
        
        if(value.active != null) state.current.active = value.active;
        if(value.inside != null) state.current.inside = value.inside;

        rerender(JSON.stringify(state));
    }, []);

    /**
     * Bind the up ref
     */
    const OnRef = useCallback((value: HTMLInputElement | null) => {
        if(value == null) return;

        BindRef(ref, {SetValue});
    }, [SetValue, ref]);

    /**
     * Handles the onfocus event
     */
    const OnFocus = useCallback((event: FocusEvent<HTMLInputElement, Element>) => {
        SetState({active: true});

        if(onFocus) onFocus(event);
    }, [onFocus, SetState]);

    /**
     * Handle the onblur event  
     * Tells any up components listening that the value has officially been updated  
     * Does nothing if the value is invalid
     */
    const OnBlur = useCallback((event: FocusEvent<HTMLInputElement, Element>) => {
        SetState({active: false});

        if(onEnter && !error.current) {
            let next: string | null | undefined | void = null;
            next = onEnter(value.current);
            if(next != null) {
                value.current = next;
                rerender("Input changed");
            }
        }

        if(onBlur) onBlur(event);
    }, [SetState, onEnter, error, rerender, value, onBlur]);

    /**
     * Handle the onchange event  
     * Updates the internal state of the input
     */
    const OnChange = useCallback((event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if(!event.target.validity.valid) {
            error.current = true;
        } else if(error.current) {
            error.current = false;
        }

        if(valueProp == null) {
            value.current = event.target.value;
        } rerender("Input changed");

        event.target.reportValidity();

        if(onChange) onChange(event);
    }, [error, value, rerender, valueProp, onChange]);
    
    /**
     * Handle the keydown event  
     * Just used to blur the input when the enter key is pressed
     */
    const OnKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
        if(event.key == "Enter") {
            (event.target as HTMLInputElement).blur();
        }

        if(onKeyDown) onKeyDown(event);
    }, [onKeyDown]);

    // Determine the color of the input
    let {shade, back} = useControllableColor(color, state.current, {silent, disabled, inverted});
    if(error.current) back = errorColor ?? colors.error;

    // Determine the class of the input
    let className = (size ?? "medium") + "-generic-input generic-input";
    if(classNameProp != null) {
        className += " " + classNameProp;
    }

    return <input
        {...props}
        ref={OnRef}
        size={undefined}
        onFocus={OnFocus}
        onBlur={OnBlur}
        className={className}
        onChange={OnChange}
        onKeyDown={OnKeyDown}
        value={value.current}
        type="number"
        style={{borderColor: back ?? inactiveColor ?? colors.neutralPalatte.Lighter(), backgroundColor: shade, ...(style ?? {})}}
    />
}