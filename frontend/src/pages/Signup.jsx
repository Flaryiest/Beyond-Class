import "../style/Signup.css"

function Signup() {
    return <div className="signup-page">
        <div className="form-container">
            <p className="title">Sign Up</p>
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