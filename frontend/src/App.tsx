import { type ReactElement } from 'react'
import './App.css'
import { useColors } from './modules/Colors';
import { Route, Routes, useLocation } from 'react-router';
import Home from './pages/home/Home';
import Navbar from './components/control/Navbar';
import Shop from './pages/shop/Shop';
import Orders from './pages/orders/Orders';
import Jobs from './pages/jobs/Jobs';
import Listing from './pages/shop/Listing';
import Login from './pages/login/Login';
import Forgot from './pages/login/Forgot';
import Reset from './pages/login/Reset';

export default function App(): ReactElement {
    const location = useLocation();
    const colors = useColors();
    const background = colors.light;

    let showNav = true;
    if(location.pathname.startsWith("/login")) showNav = false;

    return <div style={{display: "flex", flex: 1, backgroundColor: background, color: colors.TextColor(background), fontFamily: "Inter", flexDirection: "column"}}>
        {showNav ? <Navbar/> : <></>}
        <div style={{padding: 10, display: "flex", flex: 1}}>
            <Routes>
                <Route path=""       element={<Home  />}/>
                <Route path="shop">
                    <Route index         element={<Shop   />}/>
                    <Route path=":id"    element={<Listing/>}/>
                </Route>
                <Route path="orders" element={<Orders/>}/>
                <Route path="jobs"   element={<Jobs  />}/>
                <Route path="login">
                    <Route index         element={<Login  />}/>
                    <Route path="forgot" element={<Forgot />}/>
                    <Route path="reset"  element={<Reset  />}/>
                </Route>
            </Routes>
        </div>
    </div>
}