import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosPublic } from "../../api/apiMethod";
import { SubNavbar } from "../../components";
import { userProfile } from "../../features/auth/authSlice";
import { accountSubNavLinks } from "../../utils";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import './Profile.scss'
import useDocumentTitle from "../../hooks/useDocumentTitle";
import axios from "axios";

const schema = yup.object().shape({
  fullName: yup.string().required("can't be empty").trim(),
  avatar: yup
    .mixed()
    .optional()
    // .test("fileSize", "Image size can't be larger than 1MB", (file) => {
    //   return file && file[0].size <= 1048576; // 1MB = 1024 * 1024
    // }),
});

const Profile = () => {
  useDocumentTitle(`Profile - Webdev Skool`)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { currentUser, isLoading, isSuccess } = useSelector(state => state.auth);

  const [previewImage, setPreviewImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [fileError, setFileError] = useState("");

  //already stored user data in database
  const [userData, setUserData] = useState({
    fullName: currentUser?.fullName,
    email: currentUser?.email,
    avatar: currentUser?.avatar,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: userData,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  //edit user profile
  const editProfileHandler = async (data) => {
    let imgUrl = "";

    try {
      if (avatar && avatar?.size > 1048576) {
        setFileError("File size should be less than 1 MB");
        setAvatar(null);
        return
        // setFileError("File size should be less than 1 MB")
      }
      
      if (avatar && (avatar.type === "image/jpeg" || avatar.type === "image/png" || avatar.type === "image/jpg")) {
        const image = new FormData();
        image.append("file", data?.avatar[0]);
        image.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);

        //save image to cloudinary
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload?folder=${process.env.REACT_APP_CLOUDINARY_FOLDER_NAME}`, image);
        imgUrl = res?.data?.url?.toString();
      }

      await axiosPublic.put("/user/edit",
        {
          ...userData,
          avatar: imgUrl ? imgUrl : userData.avatar,
        },
        { withCredentials: true }
      );

      if (isSuccess) {
        toast.success("User profile successfully updated");
        dispatch(userProfile());
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  //delete user profile
  const deleteAccountHandler = async () => {
    try {
      const {data} = await axiosPublic.delete(`/user/delete/${currentUser?._id}`);
      if (data?.status === "Success") {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  };

  return (
    <>
      <SubNavbar title="Account" links={accountSubNavLinks} />

      <section className="profile">
        <h1>User Profile</h1>

        <form onSubmit={handleSubmit(editProfileHandler)}>
          <div className="user-avatar">
            <img
              src={previewImage ? previewImage : currentUser?.avatar}
              alt="profileimage"
            />
            <label className="input-label" htmlFor="avatar">Upload Image</label>
            <p className="input-error">{fileError !== "" ? fileError : ""}</p>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              {...register("avatar", {
                onChange: (e) => {
                  setFileError("");
                  setAvatar(e.target.files[0]);
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                },
              })}
            />
            {errors.avatar?.message && <p className="input-error">{errors.avatar?.message}</p>}
          </div>

          <div className="input-field">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              autoComplete="off"
              aria-label="Full Name"
              {...register("fullName", {
                onChange: (e) =>
                  setUserData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  })),
              })}
            />
            {errors.fullName?.message && <p className="input-error">Full Name {errors.fullName?.message}</p>}
          </div>

          <div className="input-field">
            <label className="input-label">Email</label>
            <input type="text" aria-label="Email" readOnly disabled value={currentUser?.email} />
          </div>
          
          <div className="profile-button--wrapper">
            {fileError === "" && (
              <button className="profile-save--button" disabled={!isValid}>{isLoading ? "Saving" : "Save"}</button>
              )}
              {!currentUser?.isInstructor && <input type="button" className="profile-delete--button" onClick={deleteAccountHandler} value="Delete Account" />}
          </div>
        </form>
      </section>
    </>
  );
};

export default Profile;
