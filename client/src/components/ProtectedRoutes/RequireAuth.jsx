import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const RequireAuth = () => {
    const {isLoggedin, isSuccess} = useSelector(state => state.auth)
    console.log(isLoggedin, isSuccess)

  return (
    !isLoggedin 
      ? <Navigate to='/login' replace />
      : isSuccess 
        ? <Outlet />
        : <Navigate to='/login' replace />
  )
}

export default RequireAuth