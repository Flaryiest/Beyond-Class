import "../style/Signup.css"
import { useState } from "react"
function Signup() {
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

    return <div className="signup-page">
        <div className="form-container">
            <p className="title">Sign Up</p>
            <form className="form">
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
                <button className="sign">Sign Up</button>
            </form>
                <div className="signup-line"></div>
            <p className="signup">Have an account?
                <a rel="noopener noreferrer" href="#" className="">  Login</a>
            </p>
        </div>
    </div>
    
        
}

export default Signup