import { useEffect, useRef, type ReactElement } from "react";
import Button from "./Button";
import { useColors } from "../../modules/Colors";
import { useLocation, useNavigate } from "react-router";
import { useRerender } from "../../modules/Utility";

const COLLAPSE_WIDTH = 500;

/**
 * The navbar for the app
 */
export default function Navbar(): ReactElement {
    const menuOpen = useRef<boolean>(false);

    const rerender = useRerender("Navbar");
    const colors = useColors();
    const navigator = useNavigate();
    const location = useLocation();

    const widthLog = useRef(window.innerWidth);
    widthLog.current = window.innerWidth;

    const activeTabButtonState = "hovered";

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

    return <div style={{display: "flex", flex: 0, flexDirection: "column", backgroundColor: colors.neutral, borderBottomStyle: "solid", borderBottomWidth: 1, padding: 10}}>
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
                    <Button value={location.pathname == "/"       ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("/"     )}>Home  </Button>
                    <Button value={location.pathname == "/shop"   ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("shop"  )}>Shop  </Button>
                    <Button value={location.pathname == "/orders" ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("orders")}>Orders</Button>
                    <Button value={location.pathname == "/jobs"   ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("jobs"  )}>Jobs  </Button>
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
        {collapsed && menuOpen.current
            ? <div style={{display: "flex", flexDirection: "column"}}>
                <Button value={location.pathname == "/"       ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("/"     )}>Home  </Button>
                <Button value={location.pathname == "/shop"   ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("shop"  )}>Shop  </Button>
                <Button value={location.pathname == "/orders" ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("orders")}>Orders</Button>
                <Button value={location.pathname == "/jobs"   ? activeTabButtonState : undefined} color={colors.neutral} onClick={() => navigator("jobs"  )}>Jobs  </Button>
            </div>
            : undefined
        }
    </div>
}