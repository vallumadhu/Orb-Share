import { useOutletContext } from "react-router-dom"
export default function InputBox() {
    const { handleapi, seturl, ishandling } = useOutletContext()
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