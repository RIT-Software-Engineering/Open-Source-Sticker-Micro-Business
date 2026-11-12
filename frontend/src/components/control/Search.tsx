import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactElement } from "react";

export interface ISearchProps {

}

export default function Search({}: ISearchProps): ReactElement {
    return <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 15}}>
        <div style={{flex: 1}}/>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", flex: 10, marginRight: -3.5 /** the option gets the right border cut off at small widths without this */}}>
            <FontAwesomeIcon icon={faSearch} style={{fontSize: 25, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, borderStyle: "solid", borderWidth: 1, padding: 5}}/>
            <input style={{fontSize: 22, flex: 1, minWidth: 100, margin: "0 -1px", zIndex: 1}}/>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", borderTopRightRadius: 4, borderBottomRightRadius: 4, borderStyle: "solid", borderWidth: 1, padding: 5}}>
                Newest first
                <FontAwesomeIcon icon={faChevronDown} style={{fontSize: 25}}/>
            </div>
        </div>
        <div style={{flex: 1}}/>
    </div>
}