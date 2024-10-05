import React, { useState } from 'react'
import '../style/Schedule.css'
import '../style/Classes.css'
import { useParams } from "react-router-dom"

const Classes = () => {
const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    class: ''
})

const handleChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value
    })
}

const params = useParams()

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    const response = await fetch("http://localhost:3000/api/", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userID: params.userID, startDate: formData.startDate, endDate: formData.endDate, Lesson: formData.lesson, Unit: formData.unit}),
    })
}

return (
    <div className="scheduler-container">
        <h2 className="scheduler-header class-header">My Classes</h2>
        <h2 className="scheduler-subheader">Create</h2>
        <div className="scheduler-events-container">
            <form className="scheduler-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="scheduler-label bold" htmlFor="class">Class Name*</label>
                    <input
                        type="text"
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                    />
                </div>              

                <div className="form-group">
                    <label className="scheduler-label" htmlFor="startDate">Start Date*</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="date-selector"
                    />
                </div>
                <div className="form-group">
                    <label className="scheduler-label" htmlFor="endDate">End Date*</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="date-selector"
                    />
                </div>
                  
                <button type="submit" className="submit-button">Submit</button>
            </form>
            <div className="scheduler-events"></div>
        </div>
    </div>
)
}

export default Classes