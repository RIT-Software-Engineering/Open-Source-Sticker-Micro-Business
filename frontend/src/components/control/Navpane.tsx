import { useState, type ReactElement, type ReactNode } from "react";
import Button from "./Button";
import { faClipboard, faFolder, faHouse, faStickyNote, type IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useConfig from "../../config";
import { faBars, faGear } from "@fortawesome/free-solid-svg-icons";
import useText, { TemplateText } from "../../modules/Text";
import type { Callback } from "../../Types";
import { useUser } from "../../modules/User";
import { useColors } from "../../modules/Colors";
import { useNavigate } from "react-router";
import { useIsMobile } from "../../modules/Hooks";
import BackgroundClicksScope from "./BackgroundClicks";

const ICON_SIZE = 25;

interface ISidebarTabProps {
    title : string;
    target: string;
    icon  : IconDefinition;
}

function SidebarTab({target, title, icon}: ISidebarTabProps): ReactElement {
    const colors = useColors();
    const navigate = useNavigate();

    return <Button color={colors.primary} darkOnLight onClick={() => navigate(target)} style={{alignItems: "center", display: "flex", flexDirection: "row", textAlign: "left", marginTop: 2.5, marginBottom: 2.5, padding: "15px 10px"}}>
        <div style={{flex: 1, marginRight: 10}}>{title}</div>
        <FontAwesomeIcon icon={icon} style={{fontSize: ICON_SIZE}}/>
    </Button>
}

interface ISidebarProps {
    open           : boolean;
    children?      : ReactNode | undefined;
    storeName      : string;
    onClickSidebar?: Callback  | undefined;
}

function Sidebar({open, children, storeName, onClickSidebar}: ISidebarProps): ReactElement {
    const text = useText();
    const colors = useColors();
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    return <div style={{display: "flex", flexDirection: "row", flex: 1}}>
        {open
            ? <BackgroundClicksScope onBackgroundClick={open && isMobile ? onClickSidebar : undefined} style={{top: 0, display: "flex", flexDirection: "column", borderRightStyle: "solid", borderWidth: 1, padding: 10, position: isMobile ? "absolute" : undefined, zIndex: 9, backgroundColor: colors.light}}>
                <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                    <Button onClick={() => navigate("/")          } style={{alignItems: "center", display: "flex", flexDirection: "row", backgroundColor: "#00000000", textAlign: "left"}} silent>
                        <img src={"../../../assets/images/logo-temp.webp"} style={{width: 30, height: 30, margin: -2.5}}/>
                        <h2 style={{flex: 1, marginRight: 10, fontWeight: "bold", lineHeight: "100%", marginBottom: -10, marginTop: -10, marginLeft: 12.5}}>{storeName}</h2>
                    </Button>

                    <SidebarTab icon={faHouse     } target={"/"          } title={text.nav.home      }/>
                    <SidebarTab icon={faStickyNote} target={"/shop"      } title={text.nav.shop      }/>
                    {/* <SidebarTab icon={faFolder    } target={"/categories"} title={text.nav.categories}/> */}
                    <SidebarTab icon={faClipboard } target={"/jobs"      } title={text.nav.jobs      }/>
                </div>

                <div style={{flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                    <SidebarTab icon={faGear      } target={"/settings"  } title={text.nav.settings  }/>
                </div>
            </BackgroundClicksScope>
            : undefined
        }
        {children}
    </div>
}

interface IHeaderProps {
    children?          : ReactNode | undefined;
    showSidebarControls: boolean;
    storeName          : string;
    onClickSidebar?    : Callback  | undefined;
}

function Header({children, showSidebarControls, storeName, onClickSidebar}: IHeaderProps): ReactElement {
    const text = useText();
    const user = useUser();
    const colors = useColors();
    const navigate = useNavigate();

    return <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
        <div style={{borderBottomStyle: "solid", borderWidth: 1, display: "flex", flexDirection: "row", padding: "5px 10px"}}>
            <div style={{flex: 1, alignItems: "center", display: "flex", flexDirection: "row"}}>
                <Button style={{backgroundColor: "#00000000", padding: "5px 2.5px"}} onClick={onClickSidebar}>
                    <FontAwesomeIcon icon={faBars} style={{fontSize: ICON_SIZE}}/>
                </Button>

                {showSidebarControls
                    ? <Button silent style={{backgroundColor: "#00000000", padding: "5px 2.5px", margin: "-5px 0"}} onClick={() => navigate("/")}>
                        <h3 style={{flex: 1, marginLeft: 10, fontWeight: "bold", lineHeight: "100%", margin: 0, padding: 5}}>{storeName}</h3>
                    </Button> : undefined
                }
            </div>

            <Button darkOnLight color={colors.neutral} style={{color: colors.dark, padding: "0 5px"}}>
                {TemplateText(text.nav.username, user?.Name ?? text.user.guest)}
            </Button>
        </div>
        {children}
    </div>
}

export interface INavpaneProps {
    children?: ReactNode | undefined;
    storeName: string;
    show     : boolean;
}

export default function Navpane({children, storeName, show}: INavpaneProps): ReactElement {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState<boolean>(isMobile);

    if(show) {
        return <Sidebar open={open} storeName={storeName} onClickSidebar={() => setOpen(!open)}>
            <Header showSidebarControls={!open} storeName={storeName} onClickSidebar={() => setOpen(!open)}>
                <div style={{flex: 1, overflowY: "auto"}}>
                    <div style={{display: "flex", flex: 1, padding: "10px 0 0 10px"}}>
                        {children}
                    </div>
                </div>
            </Header>
        </Sidebar>
    } else return <div style={{display: "flex", flex: 1, overflowY: "auto", padding: 10}}>
        {children}
    </div>
}