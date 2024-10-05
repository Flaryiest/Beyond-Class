function Dashboard() {
    return <div className="dashboard">
        <div className="main-content">
            <header className="header">
            <h1>Dashboard Overview</h1>
            </header>
            <div className="grid">
            <div className="card large-card">
                <h3>Main Panel</h3>
                <p>Content of the main panel...</p>
            </div>

            <div className="card small-card">
                <h3>Secondary Panel</h3>
                <p>Content of the secondary panel...</p>
            </div>

            <div className="card small-card">
                <h3>Panel 3</h3>
                <p>Content of another panel...</p>
            </div>

            <div className="card small-card">
                <h3>Panel 4</h3>
                <p>More content here...</p>
            </div>
            </div>
        </div>
    </div>
}

export default Dashboard