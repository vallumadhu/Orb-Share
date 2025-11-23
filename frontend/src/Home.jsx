import { useState, useEffect } from "react"
import QRCode from "react-qr-code";
import InputBox from "./InputBox";
import CustomInputBox from "./CustomInputBox"
import { Outlet, useLocation } from "react-router-dom";
import { useContext, createContext } from "react"
import { AppContext } from "./App";

const HomeContext = createContext()

export default function Home() {
    const { nanopath, setnanopath, copytoclipboard, setalert } = useContext(AppContext)
    const [url, seturl] = useState("")
    const [customid, setcustomid] = useState("")
    const [ishandling, setishandling] = useState(false)
    const location = useLocation()
    const handleapi = async () => {
        if (!url.trim() || url.includes(" ")) {
            setalert("Enter URL")
            return
        }
        setishandling(true);
        try {
            const response = await fetch(`http://localhost:3000/url?url=${url}`, {
                method: "POST",
            });
            if (response.status != 200) {
                console.error("Bad request");
                setalert("Something went wrong", "bad")
                return
            }
            const data = await response.json();
            setnanopath(`http://localhost:3000/url?id=${data.id}`);
            console.log(data);
        } catch (e) {
            console.error(e);
        } finally {
            setishandling(false);
        }
    }

    const customidhandleapi = async () => {
        if (!customid.trim() || customid.includes(" ")) {
            setalert("Enter ID", "bad")
            return
        }
        if (!url.trim() || url.includes(" ")) {
            setalert("Enter URL", "bad")
            return
        }
        setishandling(true);
        try {
            const response = await fetch(`http://localhost:3000/custom?url=${url}&id=${customid}`, {
                method: "POST",
            });
            if (response.status != 200) {
                console.error("URL already Exisits with this id choose any other id");
                setalert("Id already exists")
                return
            }
            const data = await response.json();
            setnanopath(`http://localhost:3000/url?id=${data.id}`);
            console.log(data);
        } catch (e) {
            console.error(e);
        } finally {
            setishandling(false);
        }
    }
    return (
        <> <HomeContext.Provider value={{ ishandling, seturl, setcustomid, customidhandleapi, handleapi }}>
            <Outlet />
            {nanopath && (location.pathname === "/" || location.pathname === "/custom-id") && (
                <div className="result-box">
                    <div className="result-container">
                        <p className="result-link">
                            <a href={nanopath}>{nanopath}</a>
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
            {nanopath && (location.pathname === "/" || location.pathname === "/custom-id") && <div className="qrBox">
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={nanopath}
                    viewBox={`0 0 256 256`}
                />
            </div>}
        </HomeContext.Provider>
        </>
    )
}

export {HomeContext}