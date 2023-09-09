import React from 'react'
import { Outlet } from 'react-router-dom'
import {Navbar} from '../components'

const Layout = () => {
  return (
    <>
     <Navbar  />

      <main className='container'>
        <Outlet />
      </main>
    </>
  )
}

export default Layout