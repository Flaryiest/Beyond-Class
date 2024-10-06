import "/src/style/Navbar.css"
import { Link } from "react-router-dom"
function NavBar() {
    return (
    <header className="navBar">
        <div>
            <Link to="/" className="logo-area">
            <img src="/assets/Beyondclass-Logo.webp" className="logo"></img>
            Beyond Class
            </Link>
        </div>
        <ul className="navLinks">
            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <div>
                    <Link to="/signup"><span className="animated secondRow">Sign up</span></Link>
                </div>
            </li>
        </ul>
        
    </header>
    )
}

export default NavBar