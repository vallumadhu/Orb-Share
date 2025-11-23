import { useContext } from "react"
import { AppContext } from "./App";
import { HomeContext } from "./Home";
export default function InputBox() {
    const { handleapi, ishandling, seturl } = useContext(HomeContext)
    return (
        <div className="input-container">
            <input
                type="text"
                className="url-input"
                placeholder="Enter URL to Shortener"
                onChange={(e) => seturl(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleapi()
                    }
                }}
            />
            <button
                className="generate-btn"
                onClick={handleapi}
                disabled={ishandling}
            >
                {ishandling ? "Generating..." : "Get Nano Path"}
            </button>
        </div>
    )
}