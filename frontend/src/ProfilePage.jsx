import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "./App"
import { useRef } from "react"
export default function ProfilePage() {
    const { setalert, email, setemail,setShowLoading } = useContext(AppContext)
    const previewBoxref = useRef()
    const [notes, setnotes] = useState([])
    const [previewnote, setpreviewnote] = useState("")
    const [previewBoxPos, setPreviewBoxPos] = useState([])
    const logoutHandler = () => {
        localStorage.setItem("token", null)
        setemail("")
        navigator("/")
    }
    const navigator = useNavigate()
    useEffect(() => {
        if (previewBoxref.current) {
            const rect = previewBoxref.current.getBoundingClientRect();

            if (rect.top < 0) {
                previewBoxref.current.style.top = "0px";
                previewBoxref.current.style.bottom = "auto";
            } else if (rect.bottom > window.innerHeight) {
                previewBoxref.current.style.top = "auto";
                previewBoxref.current.style.bottom = "0px";
            } else {
                previewBoxref.current.style.top = `${rect.top}px`;
                previewBoxref.current.style.bottom = "auto";
            }

            if (rect.left < 0) {
                previewBoxref.current.style.left = "0px";
                previewBoxref.current.style.right = "auto";
            } else if (rect.right > window.innerWidth) {
                previewBoxref.current.style.left = "auto";
                previewBoxref.current.style.right = "0px";
            } else {
                previewBoxref.current.style.left = `${rect.left}px`;
                previewBoxref.current.style.right = "auto";
            }
        }
    }, [previewnote, previewBoxPos]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setShowLoading(true)
        fetch("https://nano-path.onrender.com/data", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (!data) {
                    console.warn("Error while fetching data")
                    setShowLoading(false)
                    return;
                }
                setemail(data.email)
                setnotes(data.notes)
            })
            .catch(err => console.error("Fetch error:", err));
        setShowLoading(false)
    }, []);
    return (
        <section className="profilePage">
            <div className="wrapper">
                <img src={`/banner-img-1.jpg`} alt="" />
                <div className="profileIcon">
                    <p>{email ? email[0] : ""}</p>
                </div>
            </div>
            <div className="child">
                <h3>Baisc Info</h3>
                <div className="content">
                    <p>Email: {email}</p>
                    <p>Notes Saved: {notes?.length}</p>
                    <p>Files Saved: 0</p>
                    <p>Bookmarks Saved: 0</p>
                </div>
            </div>
            <div className="container">

                <div className="child">
                    <h3>Notes Saved</h3>
                    <div className="content">
                        {
                            notes && notes.length > 0 ? notes.map((note, index) => (
                                <div className="LinkBox" key={index}>
                                    <p>{note.id}</p>
                                    <Link to={`/note/${note.id}`}><button onMouseOver={(e) => { setpreviewnote(note.note); setPreviewBoxPos([e.clientX, e.clientY]); console.log(previewBoxPos, previewnote) }} onMouseLeave={() => setpreviewnote("")}>Open</button></Link>
                                </div>
                            )) : (
                                <div className="noContent">
                                    <p>You Haven't Saved Any Notes Yet</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="child">
                    <h3>Files Saved</h3>
                    <div className="content">
                        <div className="noContent">
                            <p>You Haven't Saved Any File Yet</p>
                        </div>
                    </div>
                </div>
                <div className="child">
                    <h3>Bookmarks</h3>
                    <div className="content">
                        <div className="noContent">
                            <p>You Haven't Bookmarked Anything Yet</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="backBtnBox">
                <button className="backBtn" onClick={() => navigator(-1)}>
                    <span>Back</span>
                </button>
            </div>
            <div className="logoutBtnBox">
                <button className="logoutBtn" onClick={logoutHandler}>
                    <span>LogOut</span>
                </button>
            </div>
            {previewnote && <div className="previewBox" ref={previewBoxref} style={{ position: "fixed", left: `${previewBoxPos[0] + 50}px`, top: `${previewBoxPos[1]}px` }}>
                <pre>{previewnote}</pre>
            </div>}

        </section>
    )
}