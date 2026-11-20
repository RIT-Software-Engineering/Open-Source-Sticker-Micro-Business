import "./StagingArea.css";
import { useCallback, type ReactElement } from "react";
import useText, { GetPlural, TemplateText } from "../modules/Text";
import { useColors } from "../modules/Colors";
import StagedItemCard from "./StagedItemCard";
import type IStagedItem from "../modules/data/StagedItem";
import type { StateRef } from "../Types";
import Button from "../components/control/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export interface IStagingAreaProps {
    staged: IStagedItem[];
    setStaged: StateRef<IStagedItem[]>;
}

export default function StagingArea({staged, setStaged}: IStagingAreaProps): ReactElement {
    const text = useText();
    const colors = useColors();

    const OnUpdateItemQuantity = useCallback((id: number, quantity: number) => {
        const item = staged.find(item => item.sticker.id == id);
        if(item == null) return;
        item.quantity = quantity;
        setStaged([...staged]);
    }, [staged]);

    const OnRemoveItem = useCallback((id: number) => {
        setStaged(staged.filter(item => item.sticker.id != id));
    }, [staged]);

    const OnBuildSheet = useCallback(() => {

    }, []);

    return <div style={{borderLeftStyle: "solid", borderWidth: 1, display: "flex", flexDirection: "column"}}>
        <div style={{borderBottomStyle: "solid", borderWidth: 1, padding: 10}}>
            <h3>{text.store.stagingArea.title}</h3>
            <div style={{fontSize: "0.75em", color: colors.neutralPalatte.Dark(), display: "contents"}}>
                {staged.length == 0
                    ? text.store.stagingArea.empty
                    : TemplateText(text.store.stagingArea.ready, staged.length.toString(), GetPlural(staged.length))
                }
            </div>
        </div>

        <div className="scrollable" style={{padding: 10, rowGap: 10, display: "flex", flexDirection: "column", flex: 1}}>
            {staged.map(value => <StagedItemCard
                key={value.sticker.id}
                item={value}
                onRemoveItem={OnRemoveItem}
                onUpdateItemQuantity={OnUpdateItemQuantity}
            />)}
        </div>

        <div style={{borderTopStyle: "solid", borderTopWidth: 1, padding: 10, display: "flex", flexDirection: "row"}}>
            <Button color={colors.primary} style={{flex: 1, display: "flex", flexDirection: "row", columnGap: 5, alignItems: "center", justifyContent: "center"}} onClick={OnBuildSheet}>
                {text.store.stagingArea.build}
                <FontAwesomeIcon icon={faArrowRight}/>
            </Button>
        </div>
    </div>
}