import "./Navpane.css";
import { useState, type ReactElement } from "react";
import Button from "./Button";
import { type IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClipboard, faGear, faHouse, faStickyNote, faStore } from "@fortawesome/free-solid-svg-icons";
import useText, { TemplateText } from "../../modules/Text";
import type { Callback } from "../../Types";
import { useUser } from "../../modules/User";
import { useColors } from "../../modules/Colors";
import { useNavigate } from "react-router";
import { useIsMobile } from "../../modules/Hooks";
import BackgroundClicksScope from "./BackgroundClicks";
import type { ISupportsChildren } from "../../modules/Types";

interface ISidebarTabProps {
    /** The title of the tab */
    title : string;
    /** The target page */
    target: string;
    /** The icon for the tab */
    icon  : IconDefinition;
}

/**
 * A button for tabs accessible from the sidebar
 */
function SidebarTab({target, title, icon}: ISidebarTabProps): ReactElement {
    const colors = useColors();
    const navigate = useNavigate();

    return <Button color={colors.primary} darkOnLight onClick={() => navigate(target)} className="navpane-sidebar-tab-button">
        <div className="navpane-sidebar-tab-title">{title}</div>
        <FontAwesomeIcon icon={icon} className="medium-icon"/>
    </Button>
}

type ISidebarProps = {
    /** Is the sidebar open */
    open           : boolean;
    /** The name of the store */
    storeName      : string;
    /** What to do when a sidebar change is requested */
    onClickSidebar?: Callback  | undefined;
} & ISupportsChildren;

/**
 * The navpane sidebar
 */
function Sidebar({open, children, storeName, onClickSidebar}: ISidebarProps): ReactElement {
    const text = useText();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    return <div className="navpane-sidebar-container">
        {open
            ? <BackgroundClicksScope onBackgroundClick={open && isMobile ? onClickSidebar : undefined} style={{position: isMobile ? "absolute" : undefined}} className="navpane-sidebar-content">
                <Button onClick={() => navigate("/")} className="navpane-sidebar-home" silent>
                    <img src={"../../../assets/images/logo-temp.webp"} className="navpane-sidebar-logo"/>
                    <h2 className="navpane-sidebar-title">{storeName}</h2>
                </Button>

                <SidebarTab icon={faHouse     } target={"/"        } title={text.nav.home    }/>
                <SidebarTab icon={faStickyNote} target={"/library" } title={text.nav.library }/>
                <SidebarTab icon={faClipboard } target={"/jobs"    } title={text.nav.jobs    }/>
                <SidebarTab icon={faStore     } target={"/store"   } title={text.nav.store   }/>

                <div className="flex-spacer"/>

                <SidebarTab icon={faGear      } target={"/settings"} title={text.nav.settings}/>
            </BackgroundClicksScope>
            : undefined
        }
        {children}
    </div>
}

type IHeaderProps = {
    /** Should the sidebar open/close controls be shown */
    showSidebarControls: boolean;
    /** The name of the store */
    storeName          : string;
    /** What to do when a sidebar change is requested */
    onClickSidebar?    : Callback | undefined;
} & ISupportsChildren;

/**
 * The navpane header
 */
function Header({children, showSidebarControls, storeName, onClickSidebar}: IHeaderProps): ReactElement {
    const text = useText();
    const user = useUser();
    const colors = useColors();
    const navigate = useNavigate();

    return <div className="navpane-header-container">
        <div className="navpane-header-content">
            <Button className="navpane-header-sidebar-control" onClick={onClickSidebar}>
                <FontAwesomeIcon icon={faBars} className="medium-icon"/>
            </Button>

            {showSidebarControls
                ? <Button silent className="navpane-header-home" onClick={() => navigate("/")}>
                    <h3 className="navpane-header-title">{storeName}</h3>
                </Button> : undefined
            }

            <div className="flex-spacer"/>

            <Button darkOnLight color={colors.neutral} className="navpane-header-user">
                {TemplateText(text.nav.username, user?.Name ?? text.user.guest)}
            </Button>
        </div>
        {children}
    </div>
}

export type INavpaneProps = {
    /** The name of the store */
    storeName: string;
    /** Should the wrapper be shown or not */
    show     : boolean;
} & ISupportsChildren;

/**
 * A navigation wrapper for the application
 */
export default function Navpane({children, storeName, show}: INavpaneProps): ReactElement {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState<boolean>(isMobile);

    if(show) {
        return <Sidebar open={open} storeName={storeName} onClickSidebar={() => setOpen(!open)}>
            <Header showSidebarControls={!open} storeName={storeName} onClickSidebar={() => setOpen(!open)}>
                <div className="navpane-container">
                    <div className="navpane-content">
                        {children}
                    </div>
                </div>
            </Header>
        </Sidebar>
    } else return <div className="navpane-disabled-content-wrapper">
        {children}
    </div>
}