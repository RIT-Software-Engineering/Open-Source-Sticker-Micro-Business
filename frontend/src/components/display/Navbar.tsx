import type { ReactElement } from "react";
import Button from "../control/Button";
import type Navigator from "../../modules/Navigator";
import { useColors } from "../../modules/Colors";

export default function Navbar({nav}: {nav: Navigator}): ReactElement {
    const colors = useColors();

    return <div style={{display: "flex", flex: 0, backgroundColor: colors.neutral, alignItems: "center", borderBottomStyle: "solid", borderBottomWidth: 1, padding: 10}}>
        <div style={{display: "flex", flex: 1, flexDirection: "row"}}>
            <img src={"../../../assets/images/logo-temp.webp"} style={{width: 25, height: 25}}/>
            <p style={{marginLeft: 10}}>Hello, Admin</p>
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
            <Button color={colors.neutral} onClick={() => nav.To()}>Home  </Button>
            <Button color={colors.neutral} onClick={() => nav.To(["shop"  ])}>Shop  </Button>
            <Button color={colors.neutral} onClick={() => nav.To(["orders"])}>Orders</Button>
            <Button color={colors.neutral} onClick={() => nav.To(["jobs"  ])}>Jobs  </Button>
        </div>
    </div>
}