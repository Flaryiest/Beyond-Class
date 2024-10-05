import '../style/UserSidebar.css'
import { useLocation, Link, useParams } from 'react-router-dom'

const UserSidebar = () => {
    let location = useLocation()
    const params = useParams()
    console.log(location.pathname)
    console.log(params.userID)
    return (
        <div className="sidebar-container">
            <aside className="sidebar">
                <h2 className="sidebar-header">BeyondClass</h2>
                <ul className="menu">
                    <li>
                        <Link to={"/user/" + params.userID} className="sidebar-link">
                            <div className="menu-item-left">
                                <img className="icon" src="/assets/dashboard.svg" alt="Dashboard" />
                                <div className="section-header-small">Dashboard</div>
                            </div>
                            <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                        </Link>
                    </li>
                    <li>
                        <Link to={"/user/" + params.userID + "/classes"} className="sidebar-link">
                            <div className="menu-item-left">
                                <img className="icon" src="/assets/units.svg" alt="Units" />
                                <div className="section-header-small">My Classes</div>
                            </div>
                            <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                        </Link>
                    </li>
                    <li>
                        <Link to={"/user/" + params.userID + "/schedule"} className="sidebar-link">
                            <div className="menu-item-left">
                                <img className="icon" src="/assets/schedule.svg" alt="Schedule" />
                                <div className="section-header-small">Schedule</div>
                            </div>
                            <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                        </Link>
                    </li>
                    <li>
                        <Link to={"/user/" + params.userID + "/settings"} className="sidebar-link">
                            <div className="menu-item-left">
                                <img className="icon" src="/assets/settings.svg" alt="Settings" />
                                <div className="section-header-small">Settings</div>
                            </div>
                            <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                        </Link>
                    </li>
                </ul>
                <div className="section-header-small sidebar-logout">Log out</div>
            </aside>
        </div>
    )
}

export default UserSidebar;