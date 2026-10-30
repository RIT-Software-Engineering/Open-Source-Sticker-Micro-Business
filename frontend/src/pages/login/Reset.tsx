import type { ReactElement } from "react";
import Button from "../../components/control/Button";
import { useNavigate } from "react-router";
import { useColors } from "../../modules/Colors";
import Logo from "../../components/display/Logo";
import Input from "../../components/control/Input";

export default function Reset(): ReactElement {
    const navigate = useNavigate();
    const colors = useColors();

    return <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <Logo/>

        <form style={{borderWidth: 1, borderStyle: "solid", padding: 16, borderRadius: 4, display: "flex", flexDirection: "column", minWidth: 250}}>
            <label htmlFor="password" style={{alignSelf: "flex-start"}}>
                New Password
            </label>
            <Input
                id="password"
                placeholder="Password"
                type="password"
                style={{outlineColor: colors.primary, marginBottom: 16, padding: 6}}
            />

            <label htmlFor="confirm" style={{alignSelf: "flex-start"}}>
                Confirm Password
            </label>
            <Input
                id="confirm"
                placeholder="Password"
                type="password"
                style={{outlineColor: colors.primary, marginBottom: 16, padding: 6}}
            />

            <Button style={{padding: "5px", marginBottom: 16}} color={colors.neutral} type="submit" onClick={() => navigate("..") /** Stub */}>
                Update Password
            </Button>
        </form>

        <div style={{flex: 1}}/>
    </div>
}