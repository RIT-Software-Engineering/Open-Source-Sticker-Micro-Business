import { type ReactElement } from 'react'
import './App.css'
import { useColors } from './modules/Colors';
import { Route, Routes, useLocation } from 'react-router';
import Home from './pages/admin/home/Home';
import Shop from './pages/shop/Shop';
import Orders from './pages/admin/orders/Orders';
import Jobs from './pages/admin/jobs/Jobs';
import Sticker from './pages/shop/Sticker';
import Login from './pages/login/Login';
import Forgot from './pages/login/Forgot';
import Reset from './pages/login/Reset';
import { BackgroundClicksProvider } from './components/control/BackgroundClicks';
import User, { UserContext } from './modules/User';
import Navpane from './components/control/Navpane';
import Settings from './pages/Settings';

const STORE_NAME = "Gold Star";

export default function App(): ReactElement {
    const location = useLocation();
    const colors = useColors();
    const background = colors.light;

    let showNav = true;
    if(location.pathname.startsWith("/login")) showNav = false;

    const user = new User();

    // Note that this is treated as the visual root component of the app (fills screen)
    return <BackgroundClicksProvider style={{width: "100vw", height: "100vh", display: "flex", flex: 1, backgroundColor: background, color: colors.TextColor(background), fontFamily: "Inter", flexDirection: "column"}}>
        <UserContext value={user}>            
            <Navpane storeName={STORE_NAME} show={showNav}>
                <div style={{padding: 10, display: "flex", flex: 1}}>
                    <Routes>
                        <Route path=""        element={<Home   />}/>
                        <Route path="shop">
                            <Route index          element={<Shop   />}/>
                            <Route path=":id"     element={<Sticker/>}/>
                        </Route>
                        <Route path="orders"  element={<Orders />}/>
                        <Route path="jobs"    element={<Jobs   />}/>
                        <Route path="login">
                            <Route index          element={<Login  />}/>
                            <Route path="forgot"  element={<Forgot />}/>
                            <Route path="reset"   element={<Reset  />}/>
                        </Route>
                        <Route path="settings" element={<Settings/>}/>
                    </Routes>
                </div>
            </Navpane>
        </UserContext>
    </BackgroundClicksProvider>
}