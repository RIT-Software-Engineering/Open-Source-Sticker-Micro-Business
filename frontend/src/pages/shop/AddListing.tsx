import { useState, type ReactElement } from "react";
import type { Callback, StateRef } from "../../Types";
import { useColors } from "../../modules/Colors";
import Button from "../../components/control/Button";
import type { IListing } from "../../modules/data/Listing";

export interface IAddListingProps {
    onSubmit?: StateRef<IListing> | undefined;
    onCancel?: Callback | undefined;
    screenPadding?: number | undefined;
}

export default function AddListing({onSubmit, onCancel, screenPadding}: IAddListingProps): ReactElement {
    const [value, setValue] = useState<IListing>({id: undefined});

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