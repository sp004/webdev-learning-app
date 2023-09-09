import React from 'react'
import { Outlet } from 'react-router-dom'
import {InstructorNavbar} from '../components'

const InstructorLayout = () => {
    return (
        <>
          <InstructorNavbar />
    
          <div className='container'>
            <Outlet />
          </div>
        </>
      )
}

export default InstructorLayout