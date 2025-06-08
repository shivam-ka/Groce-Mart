import React, { useEffect, useState } from 'react'
import { Footer, Navbar } from './components'
import { Outlet } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast"
import fetchUser from './Utils/fetchUser'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'
import { setAllCategory, setAllSubCategory, setIsCategoryLoading } from '../store/productSlice'
import summarApi from './common/SummaryApi'
import Axios from './Utils/Axios'

const App = () => {
  const dispatch = useDispatch(setIsCategoryLoading(true))

  const fetchUserHandler = async () => {
    const userData = await fetchUser()
    dispatch(setUserDetails(userData.data.data))
  }

  const fetchCategories = async () => {
    dispatch(setIsCategoryLoading(true))
    try {
      const response = await Axios({
        ...summarApi.category.getAllCategory
      })
      if (response.data.success) {
        dispatch(setAllCategory(response.data.data))
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    dispatch(setIsCategoryLoading(false))
  }

  const fetchSubCategories = async () => {

    try {
      const response = await Axios({
        ...summarApi.subCategory.getAllSubCategory
      })
      if (response.data.success) {
        dispatch(setAllSubCategory(response.data.data))
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }

  }

  useEffect(() => {
    fetchUserHandler()
    fetchCategories()
    fetchSubCategories()
  }, [])

  return (
    <>
      <Toaster position='top-right' />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
