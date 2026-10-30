import type { CSSProperties, InputHTMLAttributes, ReactElement } from "react";

/** Base customized input props */
type _ICustomInputProps = {
    style?: CSSProperties | undefined;
}

/** Props for the input component */
export type IInputProps = 
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof _ICustomInputProps> &
    _ICustomInputProps;

export default function Input(props: IInputProps): ReactElement {
    const {style} = props;

    return <input
        {...props}
        style={{...style, position: "relative"}}
    />
}