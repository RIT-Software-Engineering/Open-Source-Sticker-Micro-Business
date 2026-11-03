import { useEffect, useRef, type ReactElement } from "react";
import Button from "./Button";
import { useColors } from "../../modules/Colors";
import { useLocation, useNavigate } from "react-router";
import { useRerender } from "../../modules/Utility";
import BackgroundClicksScope from "./BackgroundClicks";
import { useUser } from "../../modules/User";

/** The state of the button for active tabs */
const ACTIVE_TAB_BUTTON_STATE = "hovered";
/** The minimum uncollapsed width of the navbar */
const COLLAPSE_WIDTH = 500;

/**
 * Display the tabs the user can select
 */
function Tabs(): ReactElement {
    const location = useLocation();
    const colors = useColors();
    const navigate = useNavigate();

    return <>
        <Button value={location.pathname == "/"       ? ACTIVE_TAB_BUTTON_STATE : undefined} color={colors.neutral} onClick={() => navigate("/"     )}>Home  </Button>
        <Button value={location.pathname == "/shop"   ? ACTIVE_TAB_BUTTON_STATE : undefined} color={colors.neutral} onClick={() => navigate("shop"  )}>Shop  </Button>
        <Button value={location.pathname == "/orders" ? ACTIVE_TAB_BUTTON_STATE : undefined} color={colors.neutral} onClick={() => navigate("orders")}>Orders</Button>
        <Button value={location.pathname == "/jobs"   ? ACTIVE_TAB_BUTTON_STATE : undefined} color={colors.neutral} onClick={() => navigate("jobs"  )}>Jobs  </Button>
    </>
}

function User(): ReactElement {
    const colors = useColors();
    const navigate = useNavigate();

    return <>
        {/* <Button color={colors.neutral}>Settings</Button> */}
        <Button color={colors.neutral} onClick={() => navigate("login") /** Logout logic here */}>Logout</Button>
    </>
}

/**
 * The navbar for the app
 */
export default function Navbar(): ReactElement {
    const menuOpen = useRef<"none" | "tabs" | "user">("none");

    const rerender = useRerender("Navbar");
    const colors = useColors();
    const user = useUser();

    const widthLog = useRef(window.innerWidth);
    widthLog.current = window.innerWidth;

    const OnClickClose = () => {
        menuOpen.current = "none"
        rerender("Menu closed");
    }

    const OnClickHamburger = () => {
        if(menuOpen.current == "tabs") {
            menuOpen.current = "none";
        } else {
            menuOpen.current = "tabs";
        } rerender("Tabs toggled");
    }

    const OnClickAdmin = () => {
        if(menuOpen.current == "user") {
            menuOpen.current = "none";
        } else {
            menuOpen.current = "user";
        } rerender("Admin toggled");
    }

    const DetermineCollapseExpand = () => {
        if(widthLog.current < COLLAPSE_WIDTH != window.innerWidth < COLLAPSE_WIDTH) {
            rerender("Navbar should collapse/expand");
        }
    }

    const collapsed = window.innerWidth < COLLAPSE_WIDTH;
    if(!collapsed && menuOpen.current == "tabs") {
        menuOpen.current = "none";
    }

    useEffect(() => {
        const ResizeListener = () => {
            DetermineCollapseExpand();
            widthLog.current = window.innerWidth;
        }

        window.addEventListener("resize", ResizeListener);

        return () => {
            window.removeEventListener("resize", ResizeListener);
        }
    }, []);

    return <BackgroundClicksScope style={{display: "flex", flex: 0, flexDirection: "column", backgroundColor: colors.neutral, borderBottomStyle: "solid", borderBottomWidth: 1, padding: 10}} onBackgroundClick={OnClickClose}>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            {/* Don't question the hamburger 🍔 */}
            {collapsed ? <Button value={menuOpen.current == "tabs" ? ACTIVE_TAB_BUTTON_STATE : undefined} color={colors.neutral} onClick={OnClickHamburger}>
                <div style={{width: 22.5, backgroundColor: "black", height: 3, marginBottom: 5}}/>
                <div style={{width: 22.5, backgroundColor: "black", height: 3, marginBottom: 5}}/>
                <div style={{width: 22.5, backgroundColor: "black", height: 3}}/>
            </Button> : undefined}

            {/* The star icon */}
            <img src={"../../../assets/images/logo-temp.webp"} style={{width: 25, height: 25, padding: 10}}/>

            {/* The uncollapsed tabs */}
            {collapsed
                ? undefined 
                : <div style={{display: "flex", flexDirection: "row"}}>
                    <Tabs/>
                </div>
            }

            <div style={{flex: 1}}/>

            {/* User buttons */}
            <div style={{display: "flex", flexDirection: "row"}}>
                <Button value={menuOpen.current == "user" ? ACTIVE_TAB_BUTTON_STATE : undefined} color={colors.neutral} onClick={OnClickAdmin}>
                    Hello, {user?.Name ?? "Guest"}
                </Button>
            </div>
        </div>

        {/* The collapsed tabs */}
        {menuOpen.current != "none"
            ? <div style={{position: "relative", margin: "10px -10px -10px", zIndex: 1}}>
                <div style={{position: "absolute", right: 0, left: 0, display: "flex", flexDirection: "column", padding: "5px 10px", backgroundColor: colors.neutral, borderTopStyle: "solid", borderBottomStyle: "solid", borderWidth: 1}}>
                    {menuOpen.current == "tabs"
                        ? <Tabs/>
                        : <User/>
                    }
                </div>
            </div>
            : undefined
        }
    </BackgroundClicksScope>
}