import {axiosPublic} from '../../api/apiMethod'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './Login.scss'
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2'
import useDocumentTitle from '../../hooks/useDocumentTitle';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required("Email is required").trim(),
})

const Login = () => {
  useDocumentTitle(`Login - Webdev Skool`)
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: {errors, isValid} //subscribe to errors state
  } = useForm({
    defaultValues: {
      email: ""
    },
    mode: "onChange",
    resolver: yupResolver(schema)
  });
  const email = watch('email')

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [status, setStatus] = useState(null)

  const loginHandler = async () => {
    try {
      const res = await axiosPublic.post('/auth/login', {email})
      setStatus(res?.status)
    } catch (error) {
      setError(error?.response?.data?.message)
      setTimeout(() => {
        setError('')  
      }, 2000);
    }
  }
  
  useEffect(() => {
    const sendOtp = async () => { 
      const res = await axiosPublic.post(`/auth/sendotp/${email}`)

      if(res.data?.otp){
        navigate(`/loginOTP/${email}`, {state: res?.data?.otp})
      }
    }
    status === 200 && sendOtp()
  }, [navigate, status, email])

  const googleLoginHandler = async (credentialResponse) => {
    await dispatch(loginWithGoogle({userToken: credentialResponse.credential}))
  }
  
  const testUserAlert = () => {
    Swal.fire({
      icon: 'info',
      title: 'Test user credential',
      html:'<b style={{color: `red`}}>test@gmail.com</b></br></br>' + 
      'For test account, OTP will be displayed on the screen. If you want to create your own account, you can sign up and will receive OTP to your email id or you can login with Google',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    })
  }

  return (
    <>
      <section className="form-container">
        <form onSubmit={handleSubmit(loginHandler)} className="form">
          <div className="input-field">
            <label>Enter Email</label>
            <input
              {...register("email", { 
                required: "Email is required"
              })}
              autoComplete='off'
            />
            <p className='input-error'>{errors.email?.message}</p>
            {error && <p className="input-error">{error}</p>}
          </div>

          <input type="submit" value="Continue" className="button" disabled={!isValid} />
          <p>
            Not registered yet? &nbsp;
            <Link to='/signup'>Sign up</Link>
          </p>

          <div className="input-field" style={{marginTop: '1rem'}}>
            <input type='button' onClick={testUserAlert} className='button-cart' value='Test user credentials' />
          </div>

          <div className='divider'>
            <hr />
            <p>OR</p>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <GoogleLogin
              onSuccess={googleLoginHandler}
              onError={() => {
                  toast.error('Login Failed');
              }}
              render={(renderProps) => (
                <button
                  className="custom-google-login-button"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Sign in with Googly
                </button>
              )}
              buttonText="Login"
            />
          </div>
        </form>
      </section>
    </>
  )
}

export default Login