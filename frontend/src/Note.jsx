import { useEffect, useRef, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "./App"

export default function Note() {
    const navigate = useNavigate()
    const { setalert, email } = useContext(AppContext)
    const textAreaRef = useRef()

    const [note, setnote] = useState("")
    const [noteid, setnoteid] = useState("")

    const getRandomnoteid = async () => {
        try {
            const res = await fetch("https://nano-path.onrender.com/note-random-id")
            const message = await res.json()
            setnoteid(message.id)
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
        try {
            const res = await fetch(`https://nano-path.onrender.com/note?id=${noteid}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "post",
                body: JSON.stringify({
                    note: note
                })
            })
            if (res.status == 200) {
                setalert("Saved Successfully!", "good")
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
                <input type="text" placeholder="Enter note name" className="note-name" onChange={(e) => setnoteid(e.target.value)} value={noteid} />
                <button onClick={getRandomnoteid}>Randomize</button>
            </div>
            <div className="protectionBox">
                <div className="option">
                    <label>Allow others to view:</label>
                    <select>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="option">
                    <label>Allow others to edit:</label>
                    <select>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="option">
                    <label>Give permission to specific users:</label>
                    <input
                        type="text"
                        placeholder="Enter email (comma-separated)"
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