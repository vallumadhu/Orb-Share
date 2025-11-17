import { useRef } from "react"
import { Link } from "react-router-dom"

export default function Note() {

    const textAreaRef = useRef()

    const heightHandle = () => {
        textAreaRef.current.style.height = "auto"
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"
    }

    return (<section className="note-section">
        <div className="text-box">
            <textarea name="" id="" ref={textAreaRef} onInput={heightHandle} placeholder="Write your note and save when you're done."></textarea>
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
            <button className="save-btn">Save</button>
        </div>
    </section>)
}