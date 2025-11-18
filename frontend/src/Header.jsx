import { Link } from "react-router-dom"
import { useState } from "react"
export default function Header() {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-left">
                    <Link to="/send-note" className="nav-link"><p>Send Note</p></Link>
                    <Link to="/note" className="nav-link"><p>Note</p></Link>

                </div>

                <div className="nav-center">
                    <Link to="/" className="brand">
                        <h1 className="title">Nano Path</h1>
                    </Link>
                    <p className="subtitle">Share Anything with one simple link</p>
                </div>

                <div className="nav-right">
                    <Link to="/custom-id" className="nav-link"><p>Custom ID</p></Link>
                    <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>
                </div>

            </nav>
            <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
                ☰
            </button>
            <div className={`sideBar ${showMenu ? "sideBarshow" : "sideBarhide"}`}>
                <nav>
                    <Link to="" className="nav-link" onClick={() => setShowMenu(false)}><p>Home</p></Link>
                    <Link to="/note" className="nav-link" onClick={() => setShowMenu(false)}><p>Note</p></Link>
                    <Link to="/send-note" className="nav-link" onClick={() => setShowMenu(false)} ><p>Send Note</p></Link>
                    <Link to="/custom-id" className="nav-link" onClick={() => setShowMenu(false)}><p>Custom ID</p></Link>
                </nav>
            </div>
        </header>

    )
}