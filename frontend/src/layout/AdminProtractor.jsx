import React, { useEffect } from 'react'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const AdminProtractor = ({ children }) => {
    const navigate = useNavigate()
    const user = useSelector(state => state.user)

    useEffect(() => {
        if (!user.role === "ADMIN") {
            navigate('/')
        }
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default AdminProtractor
