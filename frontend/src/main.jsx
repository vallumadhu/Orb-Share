import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import Login from './login.jsx'
import About from './About.jsx'
import InputBox from './InputBox.jsx'
import CustomInputBox from './CustomInputBox.jsx'
import ReciveNote from './ReciveNote.jsx'
import NoteIdInputPage from './NoteIdInputPage.jsx'
import Note from './Note.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='' element={<Home />} >
          <Route path='' element={<InputBox />} />
          <Route path='custom-id' element={<CustomInputBox />} />
          <Route path='send-note' element={<Note />} />
          <Route path='note' element={<NoteIdInputPage />} />
          <Route path='note/:id' element={<ReciveNote />} />
        </Route>
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)