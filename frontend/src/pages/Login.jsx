import "../style/Login.css"

function Login() {
    return <div className="login-page">
        <div className="login-form-container">
            <p className="title">Login</p>
            <form className="form">
                <div className="input-group">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" placeholder=""/>
                </div>
                <div className="input-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder=""/>
                    <div className="forgot">
                        <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
                    </div>
                </div>
                <button className="sign">Login</button>
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