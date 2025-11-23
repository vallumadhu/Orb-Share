import { useState } from "react"
import Header from "./Header";
import AlertBox from "./alertBox";
import Home from "./Home";
import { Outlet } from "react-router-dom";
import { createContext } from "react";


const AppContext = createContext()
function App() {
  const [alertmessages, setalertmessages] = useState([])
  const [email, setemail] = useState("")
  const copytoclipboard = () => {
    navigator.clipboard.writeText(nanopath)
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
      <AppContext.Provider value={{ copytoclipboard, setalert, setemail, email }}>
        <Header />
        <main className="main">
          <Outlet />
          <AlertBox alertmessages={alertmessages} />
        </main>
      </AppContext.Provider>
    </>
  )
}

export default App
export { AppContext }