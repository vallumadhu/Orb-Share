import { useEffect, useState } from "react"
import AlertBox from "./alertBox";
import { Outlet } from "react-router-dom";
import { createContext } from "react";
import Loading from "./loading";
import QRpopup from "./QR";


const AppContext = createContext()
function App() {
  const [alertmessages, setalertmessages] = useState([])
  const [showLoading, setShowLoading] = useState(false)
  const [email, setemail] = useState("")
  const [url, seturl] = useState("https://orbshare.netlify.app/")
  const [showQR, setshowQR] = useState(false)
  const copytoclipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setalert("Copied")
      })
      .catch(error => {
        setalert("Failed to copy", "bad")
        console.error("Failed to copy", error)
      });
  };

  const setalert = (message, type = "good") => {
    const id = Date.now();
    setalertmessages(prev => [...prev, { id: id, text: message, type: type }]);

    setTimeout(() => {
      setalertmessages(prev => prev.filter(msg => msg.id !== id));
    }, 2800)
  }
  return (
    <>
      <AppContext.Provider value={{ copytoclipboard, setalert, setemail, email, showQR, setshowQR, url, seturl, setShowLoading }}>
        <Outlet />
        <AlertBox alertmessages={alertmessages} />
        <Loading showLoading={showLoading} />
        <QRpopup />
      </AppContext.Provider>
    </>
  )
}

export default App
export { AppContext }