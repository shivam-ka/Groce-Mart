import React, { useEffect } from 'react'
import { Footer, Navbar } from './components'
import { Outlet } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import fetchUser from './Utils/fetchUser'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const App = () => {

  const dispatch = useDispatch()


  const fetchUserHandler = async () => {
    const userData = await fetchUser()
    console.log(userData.data.data);
    dispatch(setUserDetails(userData.data.data))
  }

  useEffect(() => {
    fetchUserHandler()
  }, [])

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
