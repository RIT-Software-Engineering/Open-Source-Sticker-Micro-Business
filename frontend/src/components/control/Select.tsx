import "./Select.css";
import type { ReactElement, SelectHTMLAttributes } from "react";
import type { ISupportsChildren, ISupportsStyle, TypeSplat } from "../../modules/Types";

/** Base customized button props */
type ICustomSelectProps = {

} & ISupportsStyle & ISupportsChildren;

export type ISelectProps = TypeSplat<
    SelectHTMLAttributes<HTMLSelectElement>,
    ICustomSelectProps
>;

/** A wrapped select component */
export default function Select(props: ISelectProps): ReactElement {
    const {className: classNameProp} = props;

    let className = "generic-select";
    if(classNameProp != null) {
        className += " " + classNameProp;
    }

    return <select
        {...props}
        className={className}
    />
}