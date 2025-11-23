import { useEffect, useRef, useState, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { AppContext } from "./App"

export default function ReciveNote() {
    const { setalert } = useContext(AppContext)
    const textAreaRef = useRef()

    const heightHandle = () => {
        textAreaRef.current.style.height = "auto"
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }

    const [note, setnote] = useState("")
    const { id } = useParams()

    const postNote = async () => {
        if (!note.trim()) {
            setalert("Note can't be empty", "bad")
            return
        }
        if (!id.trim()) {
            setalert("Give your note a name", "bad")
            return
        }
        try {
            const res = await fetch(`https://nano-path.onrender.com/updatenote?id=${id}`, {
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
            }

        } catch (e) {
            console.error(e)
            setalert("Error while saving", "bad")
        }
    }

    useEffect(() => {
        async function fetchNote() {
            try {
                const res = await fetch(`https://nano-path.onrender.com/note?id=${id}`);
                const data = await res.json();
                setnote(data.note.note)
            } catch (e) {
                setalert("No Note Found", "bad");
                try {
                    const res = await fetch(`https://nano-path.onrender.com/note?id=${id}`, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        method: "post",
                        body: JSON.stringify({
                            note: " "
                        })
                    })
                    if (res.status == 200) {
                        setalert(`Created a note with ${id}`, "good")
                    }

                } catch (e) {
                    console.error(e)
                    setalert("Try again", "bad")
                }
            }
        }
        fetchNote();
        heightHandle()
    }, []);


    return (<section className="note-section">
        <div className="text-box">
            <textarea name="" id="" ref={textAreaRef} onInput={heightHandle} onChange={(e) => setnote(e.target.value)} placeholder="Write your note and save when you're done." value={note}></textarea>
        </div>
        <div className="note-controls">
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
                <div className="protectionOverlay">
                    <p>Login to Access</p>
                    <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>
                </div>
            </div>
            <button className="save-btn" onClick={postNote}>Save</button>
        </div>
    </section>)
}