import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { authLogout } from '../../../features/auth/authSlice'
import { Reset } from '../../../features/Instructor/InstructorSlice'
import './MenuBox.scss'
import { clearCart } from '../../../features/cart/cartSlice'
import { clearWishlist } from '../../../features/wishlist/wishlistSlice'

const MenuBox = ({setToggle}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {currentUser, isLoggedin, isSuccess} = useSelector(state => state.auth)
    const boxRef = useRef()
    const location = useLocation()

    // Close the component if the user clicks outside of it
    const handleClickOutside = event => {
        if (boxRef.current && !boxRef.current.contains(event.target)) {
            setToggle(prev => !prev);
        }
    };

    // Add event listener to detect clicks outside of the component
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const logoutHandler = async () => {
        await dispatch(authLogout())
        await dispatch(Reset())
        await dispatch(clearCart())
        await dispatch(clearWishlist())
        if(isSuccess){
            navigate('/')
        }
    }

  return (
    <div ref={boxRef} className='dropdown-nav'>
        <div className="dropdown-nav--triangle"></div>
        <ul className='menus'>
            <li className='menu' onClick={() => navigate('/account/')}>Account</li>
            {currentUser?.isInstructor ? 
            <li className='menu mobile_nav-link'>
                <Link to={location?.state ? location.state.prev : '/instructor/dashboard/'} state={{prevPath: location.pathname}}>Instructor</Link>
            </li> :
            <li className='menu mobile_nav-link'>
                <Link to='/instructor/onboarding' state={{prevPath: location.pathname}}>Be an Instructor</Link>
            </li>
            }
            {isLoggedin && 
            <li className='menu mobile_nav-link'>
                <NavLink to='/my-courses/learning' className={(navData) => navData.isActive ? 'active' : ''}>My Learning</NavLink>
            </li>}
            <li className='menu' onClick={() => navigate('/my-courses/wishlist')}>Wishlist</li>
            {/* <li className='menu'>Dark Mode</li> */}
            <li className='menu' onClick={logoutHandler}>Logout</li>
        </ul>
    </div>
  )
}

export default MenuBox