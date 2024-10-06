import React from 'react'
import '../style/Dashboard.css'
import { useParams, Link, useOutletContext } from "react-router-dom"
import { useState, useEffect } from "react"

const Dashboard = () => {
    const params = useParams()
    const [tempClasses, setClasses, render, triggerRender, units, setUnits] = useOutletContext()
    const [classes, setRealClasses] = useState(Object.keys(tempClasses))
    const [streak, setStreak] = useState(0)
    const [quizCount, setQuizCount] = useState(0)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    console.log(tempClasses, "temp classes")
    console.log(classes, "classes")
    useEffect(() => {
        setRealClasses(Object.keys(tempClasses))
    }, [tempClasses, render])

    useEffect(() => {
        const getClasses = async () => {
            const response = await fetch("https://beyondclass.certificator.ca:3333/"+ "/get_courses", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: params.userID}),
            })
            const classes = await response.json()
            console.log(classes)
            if (Object.keys(classes).length == 0) {
                setClasses(["You Currently Have No Classes. Please Add One."])
            }
            else {
                setClasses(Object.keys(classes))
            }
        }
        getClasses()
    }, [])
    return (
        <div className="dashboard-container">
        <div className="title-card">{params.userID + "'s "} Dashboard</div>
        <div className="daily">
            <div className="rectangle-card-large">
            <div className="card-header">My Quizzes</div>
            <div className="scheduler-events">
                    {classes.map((unit, index) => (
                                <Link to={"test/" + unit} key={index} className="quiz-card">
                                    <div>
                                        <div className="class-card-title">{unit}</div>
                                    </div>
                                </Link>
                    ))}
                </div>    
            </div>
            <div className="rectangle-card-small">
                <div className="card-header">My Units</div>
                <div className="scheduler-events">
                    {units.map((unit, index) => (
                            <Link to={"test/" + unit} key={index} className="quiz-card">
                            <div>
                            <div className="class-card-title">{unit}</div>
                            </div>
                            </Link>
                        ))}
                    </div>
            </div>
        </div>
        
        <div className="square-boxes">
            <div className="square-box red">
                <div className="stat-icon-container red-icon">
                    <img src="/assets/campfire.svg" className="stat-icon "></img>
                </div>
                <div className="square-box-header">{streak}</div>
                <div className="square-box-subheader">Daily Streak</div>
                <div className="square-box-subtext"></div>
            </div>
            <div className="square-box yellow">
                <div className="stat-icon-container yellow-icon">
                    <img src="/assets/paper.svg" className="stat-icon "></img>
                </div>
                <div className="square-box-header">{quizCount}</div>
                <div className="square-box-subheader">Quizzes Done</div>
                <div className="square-box-subtext"></div>
            </div>
            <div className="square-box green">
                <div className="stat-icon-container green-icon">
                    <img src="/assets/checkmark.svg" className="stat-icon "></img>
                </div>
                <div className="square-box-header">{correctAnswers}</div>
                <div className="square-box-subheader">Correct Answers</div>
                <div className="square-box-subtext"></div>
            </div>
        </div>
        </div>
    )
    }

export default Dashboard;