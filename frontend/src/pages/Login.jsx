import "../style/Login.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
        const response = await fetch("http://localhost:3000/api/", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: formData.username, password: formData.password}),
        })
    }

    return <div className="login-page">
        <div className="login-form-container">
            <p className="title">Login</p>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" placeholder="" onChange={handleChange}/>
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="" onChange={handleChange}/>
                    <div className="forgot">
                        <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
                    </div>
                </div>  
                <button className="sign" type="submit">Login</button>
            </form>
                
            <div className="login-line"></div>
            <p className="signup">Don't have an account?
                <a rel="noopener noreferrer" href="#" className="">  Sign Up</a>
            </p>
        </div>
        <div className="login-content">
            <img className="login-image" src="/assets/classroom-image.jpg"></img>
        </div>
    </div>
    
        
}

export default Login