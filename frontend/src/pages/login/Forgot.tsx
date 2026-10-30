import type { ReactElement } from "react";
import Button from "../../components/control/Button";
import { useNavigate } from "react-router";
import { useColors } from "../../modules/Colors";
import Logo from "../../components/display/Logo";
import Input from "../../components/control/Input";

export default function Forgot(): ReactElement {
    const navigate = useNavigate();
    const colors = useColors();

    return <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <Logo/>

        <form style={{borderWidth: 1, borderStyle: "solid", padding: 16, borderRadius: 4, display: "flex", flexDirection: "column", minWidth: 250}}>
            <label htmlFor="email" style={{alignSelf: "flex-start"}}>
                Email / Username?
            </label>
            <Input
                id="email"
                placeholder="Email"
                type="email"
                style={{outlineColor: colors.primary, marginBottom: 16, padding: 6}}
            />

            <Button style={{padding: "5px", marginBottom: 16}} color={colors.neutral} type="submit" onClick={() => navigate("../reset") /** Stub */}>
                Submit Reset Password Request
            </Button>
        </form>

        <div style={{flex: 1}}/>
    </div>
}