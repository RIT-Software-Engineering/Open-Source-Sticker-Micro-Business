import type { ReactElement } from "react";
import Navbar from "./components/display/Navbar";
import { useNavigator } from "./modules/Navigator";
import config from "../config.json";
import Home from "./pages/home/Home";
import Orders from "./pages/orders/Orders";
import Shop from "./pages/shop/Shop";
import Jobs from "./pages/jobs/Jobs";
import NotFound from "./pages/NotFound";

export default function Screen(): ReactElement {
    const nav = useNavigator(config.splash);

    return <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
        <Navbar nav={nav}/>
        <div style={{display: "flex", flex: 1}}>
            {(() => {
                if(nav.current.path.length == 0) {
                    return <Home nav={nav}/>;
                }

                switch(nav.current.path[0]) {
                    case "shop"  : /* ===> */ return <Shop   nav={nav}/>; /* =X=> */ break;
                    case "orders": /* ===> */ return <Orders nav={nav}/>; /* =X=> */ break;
                    case "jobs"  : /* ===> */ return <Jobs   nav={nav}/>; /* =X=> */ break;
                    default: return <NotFound nav={nav}/>;
                }
            })()}
        </div>
    </div>
}