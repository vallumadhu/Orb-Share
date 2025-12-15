import { useEffect, useRef, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "./App"
import codeIcon from "./assets/code-solid-full.svg";
import chatIcon from "./assets/comment-solid-full.svg";
import textIcon from "./assets/spell-check-solid-full.svg";

export default function Note() {
    const navigate = useNavigate()
    const { setalert, email, setshowQR, seturl, setShowLoading } = useContext(AppContext)
    const [access, setAccess] = useState([]);
    const [edit, setedit] = useState(true);
    const [view, setview] = useState(true);

    const textAreaRef = useRef()

    const [note, setnote] = useState("")
    const [noteid, setnoteid] = useState("")

    const getRandomnoteid = async () => {
        setShowLoading(true)
        try {
            const res = await fetch("https://nano-path.onrender.com/note-random-id")
            const message = await res.json()
            setnoteid(message.id.toLowerCase())
        } catch (e) {
            console.error(e)
            setalert("Something went wrong!", "bad")
        }
        setShowLoading(false)
    }

    const fixIndentation = async () => {
        setShowLoading(true);

        try {
            const res = await fetch(
                "https://nano-path.onrender.com/note/formatter",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ note }),
                }
            );
            if (!res.ok) {
                setalert("Error while indenting", "bad")
                throw new Error("Formatter API failed")
            }
            const data = await res.json()
            if (!data.formatted) {
                setalert("Empty code returned", "bad")
                throw new Error("Formatter API failed")
            }
            setnote(data.formatted)
            console.log(data)
            setalert("Successfully indented", "good")
        } catch (e) {
            console.error(e);
            setalert("Error while indenting", "bad")
        } finally {
            setShowLoading(false);
        }
    };

    const fixGrammar = async () => {
        setShowLoading(true);

        try {
            const res = await fetch(
                "https://nano-path.onrender.com/note/grammarfix",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ note }),
                }
            );
            if (!res.ok) {
                setalert("Error while Correcting Grammar", "bad")
                throw new Error("Grammar API failed")
            }
            const data = await res.json()
            setnote(data.corrected)
            if (!data.corrected) {
                setalert("Empty note returned", "bad")
                throw new Error("Grammar API failed")
            }
            setalert("Successfully Corrected Grammar", "good")
        } catch (e) {
            console.error(e);
            setalert("Error while Correcting Grammar", "bad")
        } finally {
            setShowLoading(false);
        }
    };


    const postNote = async () => {
        if (!note.trim()) {
            setalert("Note can't be empty", "bad")
            return
        }
        if (!noteid.trim()) {
            setalert("Give your note a name", "bad")
            return
        }
        setShowLoading(true)
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
        setShowLoading(false)
    }

    return (<section className="note-section">
        <div className="text-box">
            <div className="axillary-feature-box">
                <button onClick={fixIndentation}><img src={codeIcon} alt="indentation fix" /></button>
                <button onClick={fixGrammar}><img src={textIcon} alt="grammar fix" /></button>
                <button><img src={chatIcon} alt="ask ai" /></button>
            </div>
            <textarea name="" id="" ref={textAreaRef} onChange={(e) => setnote(e.target.value)} value={note} placeholder="Write your note and save when you're done."></textarea>
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