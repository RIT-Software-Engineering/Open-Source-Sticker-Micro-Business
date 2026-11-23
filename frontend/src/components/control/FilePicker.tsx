import "./FilePicker.css"
import { useCallback, useRef, useState, type ChangeEvent, type CSSProperties, type InputHTMLAttributes, type LabelHTMLAttributes, type MouseEvent } from "react";
import type { Callback, StateRef } from "../../Types";
import { IsValidImageType, useRerender } from "../../modules/Utility";
import { FormatAsBytes } from "../../modules/Format";
import Button from "./Button";
import useText from "../../modules/Text";
import { useColors } from "../../modules/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { useControllableColor, type IControllableFlags, type IControllableState } from "./Controllable";

/** The state of the file picker */
type IState = {
    /** The file selected */
    file: File;
    /** The url of the file selected */
    url?: string | undefined;
}

/** Base customized input props */
type IFilePickerProps = {
    /** Component wrapper props */
    element?     : LabelHTMLAttributes<HTMLLabelElement> | undefined;
    /** Component file input props */
    input?       : InputHTMLAttributes<HTMLInputElement> | undefined;
    /** The color of the component */
    color?       : CSSProperties["color"];
    /** The color of the component when there is an error */
    errorColor?  : CSSProperties["color"];
    /** What to do when a file is selected */
    onEnter?     : StateRef<File> | undefined;
    /** What to do when a file is removed */
    onClear?     : Callback       | undefined;
    /** Message to display to instruct the user to drop a file */
    dropMsg?     : string         | undefined;
    /** Is this input required? */
    required?    : boolean        | undefined;
    /** The default value of the picker */
    defaultValue?: File           | undefined;
    maxFileSize? : number         | undefined;
} & IControllableFlags;

/** A wrapped file picker component */
export default function FilePicker({maxFileSize, errorColor, defaultValue, element, required, input, color, onEnter, onClear, dropMsg, disabled, inverted, silent}: IFilePickerProps) {
    const text = useText();
    const colors = useColors();

    const rerender = useRerender("FilePicker");

    /** Ref for the actual file selector */
    const inputRef = useRef<HTMLInputElement | null>(null);
    /** Has a file been selected yet or not (used for required conformation) */
    const interacted = useRef<boolean>(false);

    /** The data of the picker */
    const [file, _setFile] = useState<IState | null>(defaultValue == null || defaultValue.name.length == 0 ? null : {file: defaultValue, url: URL.createObjectURL(defaultValue)});
    /** Set the data of the picker */
    const setFile = useCallback((value: File | null) => {
        if(value == null) {
            // Clear
            _setFile(null);

            if(onClear != null) onClear();
        } else {
            // Set
            if(maxFileSize != null && value.size > maxFileSize) return;

            const next: IState = {file: value};
            if(IsValidImageType(value)) {
                next.url = URL.createObjectURL(value)
            } _setFile(next);

            if(onEnter != null) onEnter(value);
        }

        if(!interacted.current) interacted.current = true;
        
        rerender("Value updated");
    }, [file, rerender, onEnter, onClear, interacted]);

    /** The controllable state of the component */
    const state = useRef<IControllableState>({active: false, inside: false});
    /** Set the controllable state */
    const setState = useCallback((value: Partial<IControllableState>) => {
        if(state.current.active == value.active && state.current.inside == value.inside) return;

        if(value.active != null) state.current.active = value.active;
        if(value.inside != null) state.current.inside = value.inside;

        rerender(JSON.stringify(state));
    }, []);

    /**
     * What to do when the mouse enters the component
     */
    const OnEnter = useCallback((event: MouseEvent<HTMLLabelElement, globalThis.MouseEvent>) => {
        setState({inside: true});

        if(element?.onMouseEnter != null) element.onMouseEnter(event);
    }, [element?.onMouseEnter, setState]);

    /**
     * What to do when the mouse leaves the component
     */
    const OnLeave = useCallback((event: MouseEvent<HTMLLabelElement, globalThis.MouseEvent>) => {
        setState({inside: false});

        if(element?.onMouseLeave != null) element.onMouseLeave(event);
    }, [element?.onMouseLeave, setState]);

    /**
     * What to do when the component's value is changed
     */
    const OnChange = useCallback((event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const file = (event.target.files ?? [null])[0];
        if(file == null) return;

        setFile(file);

        if(input?.onChange != null) input.onChange(event);
    }, [input?.onChange, setFile]);

    /** There is an error if this input is required, there is no file and the component has been interacted with */
    const isError = interacted.current && required && file == null;
    /** If the input is required and there is no file and the user is not interacting with the element, use the error color instead */
    const effectiveColor = isError && !state.current.inside
        ? errorColor ?? colors.error
        : color;
    /** If there is a file, show as active; if there is an error, show as hovered; otherwise, use the real state */
    const effectiveState = file == null
        ? isError
            ? {inside: true}
            : state.current
        : {active: true, inside: true}
    const {back} = useControllableColor(effectiveColor, effectiveState, {disabled, inverted, silent});

    return <label htmlFor="file-input" className="generic-file-input-label" style={{backgroundColor: colors.FindPalatte(back ?? colors.neutral).Lightest(), borderColor: back ?? colors.neutral}} onMouseEnter={OnEnter} onMouseLeave={OnLeave}>
        {file != null
            ? <div className="generic-file-input-container">
                {file.url != null
                    ? <img src={file.url} className="generic-file-input-preview"/>
                    : <></>
                }

                <div className="generic-file-input-desc">
                    {file.file.name}
                    <br/>
                    {FormatAsBytes(file.file.size)}
                    <div className="generic-file-input-controls">
                        <Button className="generic-file-input-control" color={colors.primary} inverted size="none" onClick={() => inputRef.current?.click()}>
                            {text.components.filePicker.replace}
                        </Button>
                        /
                        <Button className="generic-file-input-control" color={colors.error  } inverted size="none" onClick={() => setFile(null)            }>
                            {text.components.filePicker.remove}
                        </Button>
                    </div>
                </div>

                <FontAwesomeIcon icon={faCircleCheck} className="generic-file-input-icon" color={colors.primaryPalatte.Dark()}/>
            </div> : (dropMsg ?? text.components.filePicker.drop)
        }<input ref={inputRef} type="file" id="file-input" className="generic-file-input" accept=".svg" onChange={OnChange}/>
    </label>
}