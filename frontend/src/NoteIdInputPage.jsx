import { useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"
export default function NoteIdInputPage() {
    const { setalert } = useOutletContext()
    const [noteid, setnoteid] = useState("")
    const navigate = useNavigate()
    const handlenavigate = () => {
        if (!noteid.trim()) {
            setalert("Empty note name", "bad")
        }
        navigate(`/note/${noteid}`)
    }
    return (
        <div>
            <div className="input-container">
                <input type="text" placeholder="Enter note name" className="url-input" onChange={(e) => setnoteid(e.target.value)} value={noteid} onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        handlenavigate()
                    }
                }} />
                <button className="generate-btn" onClick={handlenavigate}>Open</button>
            </div>
        </div>
    )
}