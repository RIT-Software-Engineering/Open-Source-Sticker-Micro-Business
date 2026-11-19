import type { ReactElement } from "react";
import useText, { GetPlural, TemplateText } from "../modules/Text";
import { useColors } from "../modules/Colors";
import StagedItemCard from "./StagedItemCard";
import type IStagedItem from "../modules/data/StagedItem";

export interface IStagingAreaProps {
    staged: IStagedItem[];
}

export default function StagingArea({staged}: IStagingAreaProps): ReactElement {
    const text = useText();
    const colors = useColors();

    return <div style={{borderLeftStyle: "solid", borderWidth: 1}}>
        <div style={{borderBottomStyle: "solid", borderWidth: 1, padding: 10}}>
            <h3>{text.store.stagingArea.title}</h3>
            <div style={{fontSize: "0.75em", color: colors.neutralPalatte.Dark(), display: "contents"}}>
                {staged.length == 0
                    ? text.store.stagingArea.empty
                    : TemplateText(text.store.stagingArea.ready, staged.length.toString(), GetPlural(staged.length))
                }
            </div>
        </div>

        <div style={{padding: 10}}>
            {staged.map((value, index) => <StagedItemCard
                key={index}
                item={value}
            />)}
        </div>
    </div>
}