import type { ReactElement } from "react";

export default function Logo(): ReactElement {
    return <div style={{flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
        <img src={"../../../assets/images/logo-temp.webp"} style={{width: 50, height: 50, padding: 10}}/>
        <h2>Gold Star</h2>
    </div>
}