import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const loggedInAccountType = useSelector(state => state.auth.loggedInAccountType)
    useEffect(() => {
        //-if logged in account is not of department type
        //-navigate to the home page
        if (loggedInAccountType && loggedInAccountType !== 'department') {
            navigate("/")
        }


        //-if authentication is required and user is not logged in
        //-navigate to the login page
        if (authentication && authStatus !== authentication) {
            navigate("/login")
        }


        setLoader(false)

    }, [authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}

