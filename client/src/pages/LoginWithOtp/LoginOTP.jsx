import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import './LoginOTP.scss';
import { authLogin, reset } from "../../features/auth/authSlice";
import { axiosPublic } from "../../api/apiMethod";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const LoginOTP = () => {
  useDocumentTitle(`Enter OTP - Webdev Skool`)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const dispatch = useDispatch()
  const {currentUser, message} = useSelector(state => state.auth)
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.pathname.split('/')[2]
  const refArr = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const storedEndTime = localStorage.getItem('endTime');
  const [endTime, setEndTime] = useState(storedEndTime ? JSON.parse(storedEndTime) : null);

  useEffect(() => {
    if (!localStorage.getItem('endTime')) {
      localStorage.setItem('endTime', JSON.stringify(endTime));
    }
  }, [endTime]);

  const loginHandler = async(e) => {
    e.preventDefault()
    const formattedOtp = parseInt(otp.join(''))
    await dispatch(authLogin({email, otp: formattedOtp}))
  }

  const resendOtpHandler = async () => {
    // await axiosPublic.post('/auth/login', {email})
    await axiosPublic.post(`/auth/sendotp/${email}`)
  }

  useEffect(() => {
    if(currentUser){
      navigate('/', {replace: true})
    }
    dispatch(reset())
  }, [navigate, currentUser, dispatch])

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index > 0 && !value) {
      refArr[index - 1].current.focus();
    } else if (index < 5 && value) {
      refArr[index + 1].current.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData('Text');
    const newOtp = [...otp];
    for (let i = 0; i < clipboardData.length; i++) {
      if (i < 6) {
        newOtp[i] = clipboardData[i];
      }
    }
    setOtp(newOtp);
    refArr[0].current.focus();
  };

  return (
    <div className="grid-center loginwithotp-wrapper">
      <form onSubmit={loginHandler} className="otp-container">
        {email === 'test@gmail.com' && (
          <div className="--flex-center" style={{margin: '1rem'}}>
            <h4 style={{color: `var(--color-primary)`}}>OTP:</h4>&nbsp;
            <p style={{fontWeight: 600, color: 'green'}}>{location?.state}</p>
          </div>
        )}
        <div>
          <h2>Enter 6 digit OTP</h2>
          <p>OTP sent to <span style={{fontWeight: '600'}}>{email}</span></p>
          <sub>OTP is valid for 2min. In case you don't find it, please once check in the spam folder</sub>
          {/* <div>
            <input type="number" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </div> */}
          <div className="otp-field">
            {otp.map((digit, index) => (
              <input
                type="number"
                pattern="[0-9]*"
                key={index}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                onPaste={handlePaste}
                ref={refArr[index]}
              />
            ))}
          </div>

          <p style={{color: 'red'}}>{message}</p>
        </div>
        <button className="button-cart">Login</button>
      </form>
    </div>
  );
};

export default LoginOTP;
