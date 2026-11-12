import { useState, type ReactElement } from "react";
import type { Callback, StateRef } from "../../../Types";
import { useColors } from "../../../modules/Colors";
import Button from "../../../components/control/Button";
import { GetExampleSticker, type ISticker } from "../../../modules/data/Sticker";

export interface IAddListingProps {
    onSubmit?: StateRef<ISticker> | undefined;
    onCancel?: Callback | undefined;
    screenPadding?: number | undefined;
}

/**
 * To be redone
 * @param param0 
 * @returns 
 */
export default function AddSticker({onSubmit, onCancel, screenPadding}: IAddListingProps): ReactElement {
    const [value, _setValue] = useState<ISticker>(GetExampleSticker());

    const colors = useColors();

    return <>
        <div style={{margin: screenPadding == null ? undefined : `-${screenPadding}px -${screenPadding}px 0 -${screenPadding}px`, padding: screenPadding == null ? undefined : `${screenPadding}px ${screenPadding}px 10px ${screenPadding}px`, display: "flex", flexDirection: "row", backgroundColor: colors.neutralPalatte.Light(colors.neutral), borderBottomStyle: "solid", borderBottomWidth: 1}}>
            <h2 style={{flex: 1}}>Add listing</h2>
            <Button style={{flex: 0, alignItems: "center", justifyContent: "center", flexDirection: "column", backgroundColor: "#00000000", borderStyle: "none", padding: 0}} onClick={onCancel}>
                <h2>X</h2>
            </Button>
        </div>
        
        <div style={{flex: 1}}>
            {/* Content here */}
        </div>

        <div style={{marginTop: "auto", display: "flex"}}>
            <Button color={colors.success  } onClick={onSubmit != null ? () => onSubmit(value) : undefined}>Add Listing</Button>
            <div style={{flex: 1}}/>
            <Button color={colors.secondary} onClick={onCancel}>Discard    </Button>
        </div>
    </>
}