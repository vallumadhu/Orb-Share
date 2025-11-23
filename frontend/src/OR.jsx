import QRCode from "react-qr-code";
export default function OR() {
    return (
        <>
            {"nanopath" && (location.pathname === "/" || location.pathname === "/custom-id") && (
                <div className="result-box">
                    <div className="result-container">
                        <p className="result-link">
                            <a href={"nanopath"}>{"nanopath"}</a>
                        </p>
                    </div>
                    <button onClick={copytoclipboard}><svg xmlns="http://www.w3.org/2000/svg"
                        width="20" height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 
  1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    </button>
                </div>
            )}
            {"nanopath" && (location.pathname === "/" || location.pathname === "/custom-id") && <div className="qrBox">
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={"nanopath"}
                    viewBox={`0 0 256 256`}
                />
            </div>}
        </>
    )
}