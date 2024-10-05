import React from 'react'
import '../style/Dashboard.css'

const Dashboard = () => {
    return (
        <div className="dashboard-container">
        <div className="title-card">Dashboard</div>
        <div className="daily">
            <div className="rectangle-card-large">Today's Quizzes</div>
            <div className="rectangle-card-small">Upcoming</div>
        </div>
        
        <div className="square-boxes">
            <div className="square-box">Daily Streak</div>
            <div className="square-box">Quizzes Done</div>
            <div className="square-box">Percentage of Questions answered right</div>
        </div>
        <div className="large-rectangle">Past Quizzes</div>
        </div>
    )
    }

export default Dashboard;