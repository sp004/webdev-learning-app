import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
// import './InstructorNavbar.scss'

const InstructorNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const studentHandler = () => {
        navigate(location?.state ? location.state.prevPath : '/', {state: {prev: location.pathname}})
    }

    // console.log(location)

  return (
    <nav className='space-bw'>
        {/* ==== Logo ==== */}
        <div className='logo'>
            <NavLink to='/'>
                <img src={logo} alt="logo" />
            </NavLink>
        </div>

        {/* ==== Navbar Menu ==== */}
        <div className='navlink-container'>
            <ul className="nav-links --flex-center">
                <li className='nav-link' style={{fontWeight: 500}} onClick={studentHandler}>Student</li>
            </ul>
        </div>
    </nav>
  )
}

export default InstructorNavbar