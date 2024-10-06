import '../style/Schedule.css'
import { useParams, useOutletContext } from "react-router-dom"
import { useState } from "react"

const Schedule = () => {
    const params = useParams()
    const [classes, setClasses, render, triggerRender, units, setUnits] = useOutletContext()
    console.log(units)
    const [formData, setFormData] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        lesson: '',
        unit: '',
        class: ''
    })

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        })
    }

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        const response = await fetch("https://beyondclass.certificator.ca:3333" +"/create/unit", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: params.userID, course: formData.class, lesson: formData.lesson, unit: formData.unit}),
        })
        console.log(response)
        triggerRender(prevCount => prevCount + 1)
    }

    return (
        <div className="scheduler-container">
            <form className="scheduler-form" onSubmit={handleSubmit}>
                <h2 className="scheduler-header">Schedule</h2>
                <div className="form-group">
                    <label className="scheduler-label bold" htmlFor="class">Class*</label>
                    <select
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        className="selector"
                        required>
                        <option value="">Select a class</option>
                        {units.map((classItem, index) => (
                            <option key={index} value={classItem}>
                                {classItem}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="scheduler-label bold" htmlFor="unit">Unit*</label>
                    <input
                        type="text"
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                <label className="scheduler-label" htmlFor="lesson">Lesson</label>
                <input
                    type="text"
                    id="lesson"
                    name="lesson"
                    value={formData.lesson}
                    onChange={handleChange}
                    required
                />
                </div>              
                <button type="submit" className="submit-button">Submit</button>
            </form>
            <div className="scheduler-events-container">
                <h2 className="scheduler-subheader">My Units</h2>
                <div className="scheduler-events">
                    {units.map((unit, index) => (
                        <div key={index} className="scheduler-card">
                        <div className="class-card-title">{unit}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
    }

export default Schedule