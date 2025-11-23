import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useContext } from "react"
import { AppContext } from "./App";
export default function Header() {
    const [showMenu, setShowMenu] = useState(false)
    const { email, setemail } = useContext(AppContext)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("http://localhost:3000/email", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.warn("Error while fetching email");
                    return;
                }
                if (data.email) {
                    setemail(data.email.userId);
                }
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);


    const [showLogout, setShowLogout] = useState(false);
    const logoutHandler = () => {
        localStorage.setItem("token", null)
        setemail("")
        setShowLogout(false)
    }

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
                    {email ? <div className="profileiconBox"> <div className="profileicon" onClick={() => setShowLogout(prev => !prev)}><p>{email[0]}</p> </div> {showLogout && <div className="logoutBox"><button onClick={logoutHandler}>Log Out</button></div>}</div> : <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>}
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