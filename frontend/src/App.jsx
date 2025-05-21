import React from 'react'
import { Footer, Navbar } from './components'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <>
      <Toaster />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
