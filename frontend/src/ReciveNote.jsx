import { useEffect, useRef, useState, useContext } from "react"
import { Link, useParams } from "react-router-dom"
import { AppContext } from "./App"

export default function ReciveNote() {
    const { setalert, email } = useContext(AppContext)
    const [access, setAccess] = useState([]);
    const [edit, setedit] = useState(true);
    const [view, setview] = useState(true);
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
        const token = localStorage.getItem("token")
        try {
            const res = await fetch(`https://nano-path.onrender.com/updatenote?id=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                method: "post",
                body: JSON.stringify({
                    note: note,
                    view: view,
                    edit: edit,
                    access: access,
                    email: email
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
            const token = localStorage.getItem("token")
            try {
                const res = await fetch(`https://nano-path.onrender.com/fetchnote?id=${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    method: "post",
                    body: JSON.stringify({
                        email: email
                    })
                });
                const data = await res.json();
                setnote(data.note.note)
            } catch (e) {
                setalert(e.message, "bad");
                try {
                    const res = await fetch(`https://nano-path.onrender.com/note?id=${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        },
                        method: "post",
                        body: JSON.stringify({
                            note: " ",
                            view: view,
                            edit: edit,
                            access: access,
                            email: email
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


    return (<>
        <section className="note-section">
            <div className="text-box">
                <textarea name="" id="" ref={textAreaRef} onInput={heightHandle} onChange={(e) => setnote(e.target.value)} placeholder="Write your note and save when you're done." value={note}></textarea>
            </div>
            <div className="note-controls">
                <p className="notelabel">Note Name: {id}</p>
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
                    <div className="protectionOverlay">
                        <p>Login to Access</p>
                        <Link to="/login">
                            <button className="login-btn">Login</button>
                        </Link>
                    </div>
                </div>
                <button className="save-btn" onClick={postNote}>Save</button>
            </div>
        </section></>)
}