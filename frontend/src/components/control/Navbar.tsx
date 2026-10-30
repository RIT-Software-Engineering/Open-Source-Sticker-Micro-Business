import { useEffect, useRef, type ReactElement } from "react";
import Button from "./Button";
import { useColors } from "../../modules/Colors";
import { useLocation, useNavigate } from "react-router";
import { useRerender } from "../../modules/Utility";
import BackgroundClicksScope from "./BackgroundClicks";

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

/**
 * The navbar for the app
 */
export default function Navbar(): ReactElement {
    const menuOpen = useRef<boolean>(false);

    const rerender = useRerender("Navbar");
    const colors = useColors();
    const navigator = useNavigate();

    const widthLog = useRef(window.innerWidth);
    widthLog.current = window.innerWidth;

    const OnClickHamburger = () => {
        menuOpen.current = !menuOpen.current;
        rerender("Menu toggled");
    }

    const DetermineCollapseExpand = () => {
        if(widthLog.current < COLLAPSE_WIDTH != window.innerWidth < COLLAPSE_WIDTH) {
            rerender("Navbar should collapse/expand");
        }
    }

    const collapsed = window.innerWidth < COLLAPSE_WIDTH;
    if(!collapsed) {
        menuOpen.current = false;
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

    return <BackgroundClicksScope style={{display: "flex", flex: 0, flexDirection: "column", backgroundColor: colors.neutral, borderBottomStyle: "solid", borderBottomWidth: 1, padding: 10}} onBackgroundClick={OnClickHamburger}>
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            {/* Don't question the hamburger 🍔 */}
            {collapsed ? <Button style={{backgroundColor: "#00000000"}} onClick={OnClickHamburger}>
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
                <Button color={colors.neutral} onClick={() => navigator("login")}>
                    Hello, Admin
                </Button>
            </div>
        </div>

        {/* The collapsed tabs */}
        {collapsed && menuOpen.current
            ? <div style={{position: "relative", margin: "0 -10px"}}>
                <div style={{position: "absolute", right: 0, left: 0, display: "flex", flexDirection: "column", padding: "5px 10px", backgroundColor: colors.neutral, borderTopStyle: "solid", borderBottomStyle: "solid", borderWidth: 1}}>
                    <Tabs/>
                </div>
            </div>
            : undefined
        }
    </BackgroundClicksScope>
}