import QRCode from "react-qr-code";
import { useContext } from "react";
import { AppContext } from "./App"
export default function QRpopup() {
    const { copytoclipboard, showQR, setshowQR, url } = useContext(AppContext)
    return (
        <div className="QRpopup" style={{ display: (showQR && url) ? "block" : "none" }}>
            <button className="closeBtn" onClick={() => setshowQR(false)}><span>&times;</span></button>
            <h3 className="popup-title">To Quickly Access Copy This Link</h3>

            {url && (
                <div className="result-box">
                    <div className="result-container">
                        <p className="result-link">
                            <a href={url}>{url}</a>
                        </p>
                    </div>
                    <button className="copy-btn" onClick={copytoclipboard}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="20" height="20" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 
                    1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                    </button>
                </div>
            )}

            <h3 className="popup-title">Or Scan the QR</h3>

            {url && (
                <div className="qrBox">
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={url}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            )}
        </div>

    )
}