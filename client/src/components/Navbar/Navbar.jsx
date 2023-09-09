import React, { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import './Navbar.scss'
import {CgMenuRight} from 'react-icons/cg'
import {AiOutlineClose} from 'react-icons/ai'
import {MdOutlineShoppingCart, MdOutlineAddShoppingCart} from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { userProfile } from '../../features/auth/authSlice'
import MenuBox from './MenuBox/MenuBox'
import { axiosPublic } from '../../api/apiMethod'
import NavbarSearch from './NavbarSearch/NavbarSearch'
import { fetchCartCourses } from '../../features/cart/cartSlice'
import {RxHamburgerMenu} from 'react-icons/rx'
import {GrFormClose} from 'react-icons/gr'
import SideNavbar from '../SideNavbar/SideNavbar'

const Navbar = () => {
    const {currentUser, isLoggedin} = useSelector(state => state.auth)
    const {courses, totalPrice} = useSelector(state => state.cart)
    const {course} = useSelector(state => state.course)

    const [toggleMenu, setToggleMenu] = useState(false)
    const [openMobileSideNav, setOpenMobileSideNav] = useState(false)
    // const [active, setActive] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        console.log("😷😷")
        dispatch(userProfile())
        dispatch(fetchCartCourses())
    }, [dispatch])
    // console.log(currentUser)
   console.log(courses, totalPrice)

   const openMobileSideNavHandler = () => {
    console.log("koo")
    setOpenMobileSideNav(prev => !prev)
   }
   
  return (
    <nav className='space-bw'>
        <div className='logo'>
            <NavLink to='/'>
                <img src={logo} alt="logo" onClick={() => navigate('/')} />
            </NavLink>
        </div>

        <NavbarSearch />

        <div className='navlink-container'>
            <ul className="nav-links --flex-center">
                {currentUser?.isInstructor ? 
                <li className='nav-link mobile_nav-link'>
                    <Link to={location?.state ? location.state.prev : '/instructor/dashboard/'} state={{prevPath: location.pathname}}>Instructor</Link>
                </li> :
                <li className='nav-link mobile_nav-link'>
                    <Link to='/instructor/onboarding' state={{prevPath: location.pathname}}>Be an Instructor</Link>
                </li>
                }
                {isLoggedin && 
                <li className='nav-link mobile_nav-link'>
                    <NavLink to='/my-courses/learning' className={(navData) => navData.isActive ? 'active' : ''}>My Learning</NavLink>
                </li>}

                <li className='nav-link'>
                    {courses?.length !== 0 ? 
                    <NavLink to='/cart' className='cart'>
                        <MdOutlineShoppingCart size={24} />
                        <span className='course-count'>{courses?.length}</span>
                    </NavLink> : 
                    <MdOutlineShoppingCart onClick={() => navigate('/cart')} size={24} />
                    }
                </li>
                {isLoggedin ? 
                <div className='avatar mobile-hidden' onClick={() => setToggleMenu(prev => !prev)}>
                    <img src={currentUser?.avatar} alt={currentUser?.fullName} />
                    {toggleMenu && <MenuBox setToggle={setToggleMenu} />}
                </div> : 
                <li className='nav-link mobile_nav-link'>
                    <NavLink to='/login'>Login</NavLink>
                </li>
                }
                <div className='nav-hamburger'>
                    {!openMobileSideNav && <RxHamburgerMenu className='nav-hamburger--icon' onClick={() => setOpenMobileSideNav(prev => !prev)} />}

                    <SideNavbar openMobileSideNav={openMobileSideNav} setOpenMobileSideNav={setOpenMobileSideNav} />
                </div>
            </ul>

        </div>
        
        {/* {isLoggedin && <div className='hamburger' onClick={() => setToggleMenu(prev => !prev)} >
            {!toggleMenu && <CgMenuRight />}
            {toggleMenu && <AiOutlineClose />}
        </div>} */}
    </nav>
  )
}

export default Navbar