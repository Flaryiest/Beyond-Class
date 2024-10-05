import { Outlet } from "react-router-dom"
import NavBar from "./components/Navbar"

function Layout() {
    return <div>
        <NavBar/>
        <Outlet/>
    </div>

}

export default Layout