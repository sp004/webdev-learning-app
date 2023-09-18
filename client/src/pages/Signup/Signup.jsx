import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authregister } from "../../features/auth/authSlice";
import './Signup.scss'
import useDocumentTitle from "../../hooks/useDocumentTitle";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required").trim(),
  email: yup.string().email('Please enter a valid email').required("Email is required").trim(),
})

const Signup = () => {
  useDocumentTitle(`Signup - Webdev Skool`)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, //subscribe to errors state
  } = useForm({
    defaultValues: {
      fullName: "",
      email: ""
    },
    mode: "onChange",
    resolver: yupResolver(schema)
  });
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isSuccess, message, isLoading} = useSelector(state => state.auth)
  const [error, setError] = useState('')

  const signupHandler = async (data) => {
    await dispatch(authregister(data))
    !isSuccess && setError(message)
    setTimeout(() => {
      setError('')
    }, 2000);
  };
  
  useEffect(() => {
    if(message === "Successfully registered"){
      navigate('/login')
    }
  }, [navigate, message])

  return (
    <>
      <section className="form-container">
        <form onSubmit={handleSubmit(signupHandler)} className="form">
          <h2 style={{marginBottom: '1rem'}}>Welcome to 
            <span className="gradient-title">WebDev Skool</span>
          </h2>
          <div className="input-field">
            <label>Full Name</label>
            <input
              {...register("fullName", {
                required: "FullName is required",
              })}
            />
            <p className="input-error">{errors.fullName?.message}</p>
          </div>

          <div className="input-field">
            <label>Email</label>
            <input
              {...register("email", {
                required: "Email is required",
              })}
              autoComplete="off"
            />
            <p className="input-error">{errors.email?.message}</p>
          </div>

          {error && <p className="input-error" style={{color: 'red'}}>{error}</p>}

          <input type="submit" value={isLoading ? "Signing up" : "Sign up"} className="button" disabled={!isValid} />
          <p>
            Already have an account? &nbsp;
            <Link to="/login">Login Now</Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Signup;
