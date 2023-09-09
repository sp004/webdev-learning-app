import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const InstructorRoute = () => {
    const {currentUser, isLoggedin} = useSelector(state => state.auth)

  return (
    !isLoggedin 
    ? <Navigate to='/login' replace /> 
    : !currentUser?.isInstructor  
      ? <Outlet /> 
      : <Navigate to='/instructor/dashboard' replace /> 
  )
}

export default InstructorRoute