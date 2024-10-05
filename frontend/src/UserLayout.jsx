import {Outlet} from "react-router-dom"
import UserSidebar from "./components/UserSidebar"
import "./style/UserLayout.css"
function UserLayout() {
    return <div className="user-layout">
        <UserSidebar/>
        <Outlet/>
    </div>

}

export default UserLayout