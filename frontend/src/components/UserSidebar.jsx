import '../style/UserSidebar.css';

const Dashboard = () => {
  return (
    <div className="sidebar-container">
        <aside className="sidebar">
            <h2 className="sidebar-header">BeyondClass</h2>
            <ul className="menu">
                <li>
                    <div className="menu-item-left">
                        <img className="icon" src="/assets/dashboard.svg" alt="Dashboard" />
                        <div className="section-header-small">Dashboard</div>
                    </div>
                    <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                </li>
                <li>
                    <div className="menu-item-left">
                        <img className="icon" src="/assets/units.svg" alt="Units" />
                        <div className="section-header-small">Units</div>
                    </div>
                    <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                </li>
                <li>
                    <div className="menu-item-left">
                        <img className="icon" src="/assets/schedule.svg" alt="Schedule" />
                        <div className="section-header-small">Schedule</div>
                    </div>
                    <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                </li>
                <li>
                    <div className="menu-item-left">
                        <img className="icon" src="/assets/settings.svg" alt="Settings" />
                        <div className="section-header-small">Settings</div>
                    </div>
                    <img className="icon" src="/assets/right-arrow.svg" alt="Right Arrow" />
                </li>
            </ul>
            <div className="section-header-small sidebar-logout">Log out</div>
        </aside>
    </div>
  )
}

export default Dashboard;