import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosPublic } from "../../api/apiMethod";
import { userProfile } from "../../features/auth/authSlice";
import './InstructorOnboard.scss'
import { toast } from "react-hot-toast";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  designation: yup.string().required("Designation is required").trim(),
  bio: yup.string().required("Bio is required.").trim(),
})
const InstructorOnboard = () => {
  useDocumentTitle(`Instructor Onboarding - Webdev Skool`)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, //subscribe to errors state
  } = useForm({
    defaultValues: {
      designation: "",
      bio: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userProfile())
  }, [dispatch])
  
  const onboardHandler = async(instructorData) => {
    try {
        const {data} = await axiosPublic.post('/instructor/onboard', instructorData)
        data?.status === 'Success' && toast.success(data?.message)
        setTimeout(() => {
          navigate('/instructor/create-course', {replace: true})
        }, 2000);
    } catch (error) {
      toast.error('Something went wrong')
        // console.error(error.message);
    }
  }

  return (
    <div className="instructor-onboard_container">
      <h1>Complete the Onboarding Process</h1>

      <form className="instructor-onboard_form" onSubmit={handleSubmit(onboardHandler)}>
        <div className="input-field">
          <label className="input-label">Designation</label>
          <input type="text" autoComplete="off" 
            {...register("designation", {
              required: "Designation is required",
            })}
          />
          <p className="input-error">{errors.designation?.message}</p>
        </div>

        <div className="input-field">
          <label className="input-label">Bio</label>
          <textarea
            rows={10}
            cols={150}
            {...register("bio", {
              required: "Bio is required",
            })}
          />
          <p className="input-error">{errors.bio?.message}</p>
        </div>
        
        <div className="onboard-button--wrapper">
          <input type="submit" className="button" value="Submit" disabled={!isValid} /> 
        </div>
      </form>
    </div>
  );
};

export default InstructorOnboard;
