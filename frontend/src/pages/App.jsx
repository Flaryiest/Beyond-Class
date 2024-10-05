import { useState } from 'react'
import '../style/App.css'
import Navbar from "../components/Navbar.jsx"
function App() {
  return (
    <div>
      <Navbar></Navbar>

      <h1>Beyond Class</h1>
      <div className="card">
      </div>
      <p className="read-the-docs">
      </p>
    </div>
  )
}

export default App
