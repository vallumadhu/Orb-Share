import { useState, useContext } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { AppContext } from "./App"
export default function NoteIdInputPage() {
    const { setalert } = useContext(AppContext)
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
                <input type="text" placeholder="Enter note name" className="url-input" onChange={(e) => setnoteid(e.target.value.toLowerCase())} value={noteid} onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        handlenavigate()
                    }
                }} />
                <button className="generate-btn" onClick={handlenavigate}>Open</button>
            </div>
        </div>
    )
}