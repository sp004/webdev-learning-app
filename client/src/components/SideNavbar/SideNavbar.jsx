import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { RiArrowRightSLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearWishlist } from "../../features/wishlist/wishlistSlice";
import { clearCart } from "../../features/cart/cartSlice";
import { Reset } from "../../features/Instructor/InstructorSlice";
import { authLogout } from "../../features/auth/authSlice";
import "./SideNavbar.scss";

const SideNavbar = ({openMobileSideNav, setOpenMobileSideNav}) => {
  const { currentUser, isLoggedin, isSuccess } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpenMobileSideNav(prev => !prev)
  }, [])

  const logoutHandler = async () => {
    await dispatch(authLogout());
    await dispatch(Reset());
    await dispatch(clearCart());
    await dispatch(clearWishlist());
    if (isSuccess) {
      navigate("/");
    }
  };

  return (
    <div className={`side-navbar ${openMobileSideNav ? 'open' : ''}`}>
      <MdClose
        className="side-navbar--close"
        onClick={() => setOpenMobileSideNav(prev => !prev)}
      />
      <ul className="menus">
        {isLoggedin ? (
          <div className="side-navbar--top" onClick={() => {
            navigate("/account/")
            setOpenMobileSideNav(prev => !prev)
          }}>
            <img src={currentUser?.avatar} alt={currentUser?.fullName} />
            <div className="side-navbar--userinfo">
              <p className="side-navbar--userinfo-name">
                Hi, {currentUser?.fullName}
              </p>
              <span>Welcome back</span>
            </div>
            <RiArrowRightSLine className="side-navbar--account" />
          </div>
        ) : (
          <li className="menu" onClick={() => setOpenMobileSideNav(prev => !prev)}>
            <NavLink to="/login">Login</NavLink>
          </li>
        )}
        {currentUser?.isInstructor ? (
          <li className="menu">
            <NavLink
              to={
                location?.state ? location.state.prev : "/instructor/dashboard/"
              }
              state={{ prevPath: location.pathname }}
            >
              Instructor
            </NavLink>
          </li>
        ) : (
          <li className="menu">
            <NavLink
              to="/instructor/onboarding"
              state={{ prevPath: location.pathname }}
            >
              Be an Instructor
            </NavLink>
          </li>
        )}
        {isLoggedin && (
          <>
            <li className="menu" onClick={() => setOpenMobileSideNav(prev => !prev)}>
              <NavLink
                to="/my-courses/learning"
                className={(navData) => (navData.isActive ? "active" : "")}
              >
                My Learning
              </NavLink>
            </li>
            <li
              className="menu"
              onClick={() => setOpenMobileSideNav(prev => !prev)}
            >
              <NavLink
                to="/my-courses/wishlist"
                className={(navData) => (navData.isActive ? "active" : "")}
              >
                Wishlist
              </NavLink>
            </li>
            {/* <li className='menu'>Dark Mode</li> */}
            <li className="menu" onClick={logoutHandler}>
              Logout
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SideNavbar;
