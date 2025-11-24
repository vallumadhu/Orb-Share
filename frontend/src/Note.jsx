import { useEffect, useRef, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "./App"

export default function Note() {
    const navigate = useNavigate()
    const { setalert, email, setshowQR, seturl } = useContext(AppContext)
    const [access, setAccess] = useState([]);
    const [edit, setedit] = useState(true);
    const [view, setview] = useState(true);

    const textAreaRef = useRef()

    const [note, setnote] = useState("")
    const [noteid, setnoteid] = useState("")

    const getRandomnoteid = async () => {
        try {
            const res = await fetch("https://nano-path.onrender.com/note-random-id")
            const message = await res.json()
            setnoteid(message.id.toLowerCase())
        } catch (e) {
            console.error(e)
            setalert("Something went wrong!", "bad")
        }
    }

    const postNote = async () => {
        if (!note.trim()) {
            setalert("Note can't be empty", "bad")
            return
        }
        if (!noteid.trim()) {
            setalert("Give your note a name", "bad")
            return
        }
        const token = localStorage.getItem("token")
        try {
            const res = await fetch(`https://nano-path.onrender.com/note?id=${noteid}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                method: "post",
                body: JSON.stringify({
                    note: note,
                    view: view,
                    edit: edit,
                    access: access
                })
            })
            if (res.status == 200) {
                setalert("Saved Successfully!", "good")
                seturl(`https://orbshare.netlify.app/note/${noteid}`)
                setshowQR(true)
                navigate(`/note/${noteid}`)
            }

        } catch (e) {
            console.error(e)
            setalert("Error while saving", "bad")
        }
    }

    return (<section className="note-section">
        <div className="text-box">
            <textarea name="" id="" ref={textAreaRef} onChange={(e) => setnote(e.target.value)} placeholder="Write your note and save when you're done."></textarea>
        </div>
        <div className="note-controls">
            <div className="note-id-controls">
                <input type="text" placeholder="Enter note name" className="note-name" onChange={(e) => setnoteid(e.target.value.toLowerCase())} value={noteid} />
                <button onClick={getRandomnoteid}>Randomize</button>
            </div>
            <div className="protectionBox">
                <div className="option">
                    <label>Allow others to view:</label>
                    <select onChange={(e) => setview(e.target.value === "true")} value={view}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="option">
                    <label>Allow others to edit:</label>
                    <select onChange={(e) => setedit(e.target.value === "true")} value={edit ? "true" : "false"} >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                <div className="option">
                    <label>Give permission to specific users:</label>
                    <input
                        type="text"
                        placeholder="Enter email (comma-separated)"
                        onChange={(e) => setAccess(e.target.value.split(",").map((email) => email.trim().toLowerCase()).filter(email => email.length > 0))}
                    />
                </div>
                {!email && <div className="protectionOverlay">
                    <p>Login to Access</p>
                    <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>
                </div>}

            </div>
            <button className="save-btn" onClick={postNote}>Save</button>
        </div>
    </section>)
}