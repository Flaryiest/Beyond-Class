import "../style/Signup.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const endpoint = "http://184.64.116.12:3333"
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    })
    
    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Form data submitted:', formData);
        const response = await fetch(endpoint + "/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: formData.username, password: formData.password, email: formData.email}),
        })
        console.log(response)
        if (response.status == 200) {
            const info = await response.json()
            console.log(info)
            if (info.success == false) {
                setError(info.json.reason)
            }
            else {
                navigate("/login")  
            }
            
        }
    }


    return <div className="signup-page">
        <div className="form-container">
            <p className="title">Sign Up</p>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder="" onChange={handleChange}/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" placeholder="" onChange={handleChange}/>
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="" onChange={handleChange}/>
                    <div className="forgot">
                        <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
                    </div>
                </div>
                <div>
                    {(error) && <div className="error-message">{error}</div>}
                </div>
                <button className="sign">Sign Up</button>
            </form>
                <div className="signup-line"></div>
            <p className="signup">Have an account?
                <a rel="noopener noreferrer" href="#" className=""> Login</a>
            </p>
        </div>
    </div>
    
        
}

export default Signup