import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubNavbar } from "../../components";
import { getInstructor, Reset} from "../../features/Instructor/InstructorSlice";
import "../Profile/Profile.scss";
import { axiosPublic } from "../../api/apiMethod";
import { accountSubNavLinks } from "../../utils";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const schema = yup.object().shape({
  designation: yup.string().required("Designation can't be empty").trim().max(60),
  bio: yup.string().required("Bio can't be empty").trim(),
});

const InstructorProfile = () => {
  useDocumentTitle(`Instructor Profile - Webdev Skool`)
  const { _id } = useSelector((state) => state.auth.currentUser);
  const { isLoading, instructor } = useSelector(state => state.instructor);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInstructor(_id));
  }, [dispatch, _id]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      bio: instructor?.bio,
      designation: instructor?.designation,
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [designation, bio] = watch(["designation", "bio"]);

  const editInstructorHandler = async () => {
    try {
      const res = await axiosPublic.patch(
        "/instructor/edit",
        { designation, bio },
        { withCredentials: true }
      );
      if (res?.status === 200) {
        toast.success("Instructor updated successfully");
        dispatch(getInstructor(_id));
        // navigate('/account')
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div>
        <SubNavbar title="Account" links={accountSubNavLinks} />
      </div>

      <div className="profile">
        <h1>Instructor Profile</h1>

        <form onSubmit={handleSubmit(editInstructorHandler)}>
          <div className="input-field">
            <label className="input-label">Designation</label>
            <input
              type="text"
              autoComplete="off"
              {...register("designation", {
                required: "Designation is required"
              })}
            />
            {errors.designation?.message && <p className="input-error">{errors.designation?.message}</p>}
          </div>

          <div className="input-field">
            <label className="input-label">Bio</label>
            <textarea
              cols={30}
              rows={10}
              {...register("bio", {
                required: "Bio is required"
              })}
            />
            {errors.bio?.message && <p className="input-error">{errors.bio?.message}</p>}
          </div>

          <div className="profile-button--wrapper">
            <button className="profile-save--button" disabled={!isValid}>
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InstructorProfile;
