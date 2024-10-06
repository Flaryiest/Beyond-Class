import '../style/Schedule.css'
import '../style/Classes.css'
import { useParams, useOutletContext } from "react-router-dom"
import { useState, useEffect } from "react"
const Classes = () => {
    const params = useParams()
    const [tempClasses, setClasses, render, triggerRender, units, setUnits]= useOutletContext()
    const [classes, setRealClasses] = useState(Object.keys(tempClasses))
    console.log(classes, "classes")
    const [formData, setFormData] = useState({
        class: ''
    })

    useEffect(() => {
        setRealClasses(Object.keys(tempClasses))
    }, [tempClasses, render])

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData.class);
        const response = await fetch("https://beyondclass.certificator.ca:3333" + "/create/course", {
            method: "POST",
            credentials: "include",
            headers: {  
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: params.userID, course: formData.class}),
        })
        triggerRender(prevCount => prevCount + 1)
        if (response) {
            triggerRender(prevCount => prevCount + 1)
        }
        formData.class = ''
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
                    <button type="submit" className="submit-button">Submit</button>
                </form>

                <div className="scheduler-events">
                    {Array.isArray(classes) && classes.map((classItem, index) => (
                        <div key={index} className="class-card">
                            <div className="class-card-title">{classItem}</div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    )
    }

    export default Classes