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

const ICON_SIZE = 25;

function SidebarDivider(): ReactElement {
    return <div style={{display: "flex", flexDirection: "row", paddingRight: 5, paddingLeft: 5}}>
        <div style={{flex: 1, backgroundColor: "black", height: 1}}/>
    </div>
}

interface ISidebarTabProps {
    title : string;
    target: string;
    icon  : IconDefinition;
}

function SidebarTab({target, title, icon}: ISidebarTabProps): ReactElement {
    const navigate = useNavigate();

    return <Button onClick={() => navigate(target)} style={{alignItems: "center", display: "flex", flexDirection: "row", backgroundColor: "#00000000", textAlign: "left", marginTop: 2.5, marginBottom: 2.5, padding: "15px 10px"}}>
        <div style={{flex: 1, marginRight: 10}}>{title}</div>
        <FontAwesomeIcon icon={icon} style={{fontSize: ICON_SIZE}}/>
    </Button>
}

interface ISidebarProps {
    open     : boolean;
    children?: ReactNode | undefined;
    storeName: string;
}

function Sidebar({open, children, storeName}: ISidebarProps): ReactElement {
    const text = useText();

    const navigate = useNavigate();

    return <div style={{display: "flex", flexDirection: "row", flex: 1}}>
        {open
            ? <div style={{display: "flex", flexDirection: "column", borderRightStyle: "solid", borderWidth: 1, padding: 10}}>
                <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                    <Button onClick={() => navigate("/")          } style={{alignItems: "center", display: "flex", flexDirection: "row", backgroundColor: "#00000000", textAlign: "left"}} silent>
                        <img src={"../../../assets/images/logo-temp.webp"} style={{width: 25, height: 25, marginRight: 10}}/>
                        <h2 style={{flex: 1, marginRight: 10, fontWeight: "bold", lineHeight: "100%", marginBottom: -10, marginTop: -10}}>{storeName}</h2>
                    </Button>

                    <SidebarTab icon={faHouse     } target={"/"          } title={text.nav.home      }/>
                    <SidebarDivider/>
                    <SidebarTab icon={faStickyNote} target={"/shop"      } title={text.nav.shop      }/>
                    <SidebarDivider/>
                    <SidebarTab icon={faFolder    } target={"/categories"} title={text.nav.categories}/>
                    <SidebarDivider/>
                    <SidebarTab icon={faClipboard } target={"/jobs"      } title={text.nav.jobs      }/>
                </div>

                <div style={{flex: 0, display: "flex", flexDirection: "column"}}>
                    <SidebarTab icon={faGear      } target={"/settings"  } title={text.nav.settings  }/>
                </div>
            </div>
            : undefined
        }
        {children}
    </div>
}

interface IHeaderProps {
    children?          : ReactNode | undefined;
    showSidebarControls: boolean;
    storeName          : string;
    onClickSidebar?    : Callback;
}

function Header({children, showSidebarControls, storeName, onClickSidebar}: IHeaderProps): ReactElement {
    const text = useText();
    const user = useUser();
    const colors = useColors();
    const navigate = useNavigate();

    return <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
        <div style={{borderBottomStyle: "solid", borderWidth: 1, display: "flex", flexDirection: "row", padding: 10}}>
            <div style={{flex: 1, alignItems: "center", display: "flex", flexDirection: "row"}}>
                <Button style={{backgroundColor: "#00000000", padding: "5px 2.5px"}} onClick={onClickSidebar}>
                    <FontAwesomeIcon icon={faBars} style={{fontSize: ICON_SIZE}}/>
                </Button>

                {showSidebarControls
                    ? <Button silent style={{backgroundColor: "#00000000", padding: "5px 2.5px"}} onClick={() => navigate("/")}>
                        <h3 style={{flex: 1, marginLeft: 10, fontWeight: "bold", lineHeight: "100%", margin: 0, padding: 5}}>{storeName}</h3>
                    </Button> : undefined
                }
            </div>

            <Button outline color={colors.neutral} style={{color: colors.dark}}>
                {TemplateText(text.nav.username, user?.Name ?? text.user.guest)}
            </Button>
        </div>
        {children}
    </div>
}

export interface INavpaneProps {
    children?: ReactNode | undefined;
    storeName: string;
}

export default function Navpane({children, storeName}: INavpaneProps): ReactElement {
    const config = useConfig();
    const [open, setOpen] = useState<boolean>(window.innerWidth > config.navbar.collapseWidth);

    return <Sidebar open={open} storeName={storeName}>
        <Header showSidebarControls={!open} storeName={storeName} onClickSidebar={() => setOpen(!open)}>
            {children}
        </Header>
    </Sidebar>
}