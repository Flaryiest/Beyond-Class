import "../style/Login.css"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState(false)
    const handleChange = (e) => {
        setFormData({   
        ...formData,
        [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Form data submitted:', formData);
        const response = await fetch("http://184.64.116.12:3333" + "/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: formData.username, password: formData.password}),
        })
        if (response.status == 200) {
            const info = await response.json()
            console.log(response, info)
            if (info.success == false ) {
                setError("Login failed. Please try again.")
            }
            else {
                navigate("/user/" + formData.username)
            }
        }
        setError("Login failed. Please try again.")
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
                {(error) && <div className="error-message">{error}</div>}
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