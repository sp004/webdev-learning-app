import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Footer, InstructorRoute, RequireAuth } from './components'
import Layout from './layout/Layout'
import { authLogout, reset, userProfile } from './features/auth/authSlice'
import { Cart, Checkout, CourseDetails, Home, InstructorOnboard, InstructorProfile, Login, MyCourses, PaymentSuccessful, Profile, PurchaseHistory, Signup, UploadedCourse, Wishlist, SearchedCourse, ApprovalPending, BadRequest } from './pages'
import CreateCourse from './pages/CreateCourse/CreateCourse'
import LoginOTP from './pages/LoginWithOtp/LoginOTP'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Reset } from './features/Instructor/InstructorSlice'
import { clearCart } from './features/cart/cartSlice'
import { Toaster } from 'react-hot-toast'
import InstructorLayout from './layout/InstructorLayout'
import { clearWishlist } from './features/wishlist/wishlistSlice'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles/style.scss'

const queryClient = new QueryClient()

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation();
  const {currentUser, message} = useSelector(state => state.auth)
  
  // fetching loggedin user information
  useEffect(() => {
    if(!currentUser?.isInstructor){
      dispatch(userProfile())
    } 
  }, [dispatch, currentUser?.isInstructor])
  
  useEffect(() => {
    if(message?.includes('Please login')){
      dispatch(authLogout())
      dispatch(Reset())
      dispatch(reset())
      dispatch(clearCart())
      dispatch(clearWishlist())
      navigate('/login', {replace: true})
    }
  }, [message, dispatch, navigate])

  // Check if current path matches any of the excluded routes
  const excludePaths = ['/loginOTP/:email',];
  const shouldExclude = excludePaths.some(path => pathname?.includes(path));

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='course/:courseId' element={<CourseDetails />} />
            <Route path='course/search' element={<SearchedCourse />} />

            <Route path='login' element={!currentUser ? <Login /> : <Navigate to={`/`} />} />
            <Route path='loginOTP/:email' element={!currentUser ? <LoginOTP /> : <Navigate to={`/`} />} />
            <Route path='signup' element={!currentUser ? <Signup /> : <Navigate to={`/`} />} />

            <Route element={<RequireAuth />}>
              <Route path='account'>
                <Route index element={<Profile />}/>
                <Route path='instructor' element={<InstructorProfile />} />
                <Route path='purchase-history' element={<PurchaseHistory />} />
              </Route>
            </Route>

            <Route element={<RequireAuth />}>
              <Route path='my-courses'>
                <Route path='learning' element={<MyCourses />} />
                <Route path='wishlist' element={<Wishlist />} />
              </Route>
            </Route>

            <Route element={<RequireAuth />}>
              <Route path='/'>
                <Route path='cart' element={<Cart />} />
                <Route path='checkout' element={<Checkout />} />
                <Route path='paymentsuccess' element={<PaymentSuccessful />} />
              </Route>
            </Route>
          </Route>
          
          <Route element={<InstructorLayout />}>
            <Route path='instructor'>
              <Route element={<InstructorRoute />}>
                <Route path='onboarding' element={<InstructorOnboard />} />
              </Route>
              <Route path='create-course' element={currentUser?.isInstructor ? <CreateCourse /> : <Navigate to={`/instructor/onboarding`} />} />
              <Route path='approval-pending' element={currentUser?.isInstructor ? <ApprovalPending /> : <Navigate to={`/instructor/onboarding`} />} />
              <Route path='dashboard' element={currentUser?.isInstructor ? <UploadedCourse /> : <Navigate to={`/instructor/onboarding`} />} />
            </Route>
          </Route>

          <Route path='*' element={<BadRequest />} />
        </Routes>
      </GoogleOAuthProvider>
      {!shouldExclude && <Footer />}
    </QueryClientProvider>
  )
}

export default App