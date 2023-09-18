import React, { useCallback, useEffect, useState } from "react";
import "./CourseAction.scss";
import Modal from "react-modal";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartCourses } from "../../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { toast } from "react-hot-toast";
import {
  addToWishlist,
  getWishlistCourses,
  removeWishlist,
} from "../../../features/wishlist/wishlistSlice";
import { AiFillInfoCircle } from "react-icons/ai";
import useCheckEnrolled from "../../../hooks/useCheckEnrolled";

Modal.setAppElement("#root");

const CourseActionInfo = ({ course }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { courses: cartCourses } = useSelector((state) => state.cart);
  const { courses: wishlistCourses } = useSelector((state) => state.wishlist);
  const { currentUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isEnrolled, enrolledDate } = useCheckEnrolled(course._id);

  // fetching cart and wishlist courses while loading the page
  useEffect(() => {
    dispatch(getWishlistCourses());
    dispatch(fetchCartCourses());
  }, [dispatch]);

  //check whether the course is in cart or in wishlist
  useEffect(() => {
    setIsWishlisted(false);
    if (
      wishlistCourses?.some(
        (wishlistCourse) => wishlistCourse._id === course?._id
      )
    ) {
      setIsWishlisted(true); //will be true
    }
  }, [course?._id, wishlistCourses]);

  //add course to wishlist
  const addToWishList = async (courseId) => {
    if (currentUser === null) {
      toast.error("Please login to add into wishlish");
      return;
    }

    await dispatch(addToWishlist(courseId));
    await dispatch(getWishlistCourses());
    setIsWishlisted(true);
  };

  //remove course from wishlist
  const removeFromWishList = useCallback(
    async (courseId) => {
      await dispatch(removeWishlist(courseId));
      await dispatch(getWishlistCourses());
      setIsWishlisted(false);
    },
    [dispatch]
  );

  //add course to cart
  const addToCartHandler = async (courseId) => {
    if (currentUser === null) {
      toast.error("Please login to add to cart");
      return;
    }

    await dispatch(addToCart(courseId));
    await dispatch(fetchCartCourses());
    // setAddedToCart((prev) => !prev);

    if (
      wishlistCourses?.some((wishlistCourse) => wishlistCourse._id === courseId)
    ) {
      dispatch(removeWishlist(courseId));
      setIsWishlisted(false);
      dispatch(getWishlistCourses());
    }
  };

  // check if the course is already in the cart
  // useEffect(() => {
  //   if (courses?.filter((item) => item?._id === course?._id)?.length > 0) {
  //     setAddedToCart(true);
  //   } else {
  //     setAddedToCart(false);
  //   }
  // }, [courses, course]);

  // check if the course is already in the wishlist
  // useEffect(() => {
  //   if (wishlistCourses?.filter((item) => item?._id === course?._id)?.length > 0) {
  //     setIsWishlisted(true);
  //   } else {
  //     setIsWishlisted(false);
  //   }
  // }, [wishlistCourses, course]);

    const checkoutHandler = useCallback((course) => {
        navigate("/checkout", { state: [course] });
    },[navigate]);

  return (
    <>
      {!isEnrolled ? (
        <>
          <div className="course-price">
            <h3>₹{course?.price}</h3>
            <p>
              <strike style={{ color: "gray" }}>
                ₹{Math.ceil(5 * course?.price)}
              </strike>{" "}
              <span>80% off</span>
            </p>
          </div>
          <div className="course-actions">
            {cartCourses?.some(
              (cartCourse) => cartCourse._id === course._id
            ) ? (
              <button onClick={() => navigate("/cart")}>Go to cart</button>
            ) : (
              <button onClick={() => addToCartHandler(course?._id)}>
                Add to cart
              </button>
            )}
            <div className="course-wishlist">
              {isWishlisted ? (
                <BsHeartFill onClick={() => removeFromWishList(course?._id)} />
              ) : (
                <BsHeart onClick={() => addToWishList(course?._id)} />
              )}
            </div>
          </div>
          <button
            className="course-buynow"
            onClick={() => checkoutHandler(course)}
          >
            Buy Now
          </button>
        </>
      ) : (
        <div className="enrollment-date">
          <AiFillInfoCircle className="info-icon" />
          <p>
            You enrolled this course on{" "}
            {moment(enrolledDate).format("MMM. DD, YYYY")}
          </p>
        </div>
      )}
      <p
        style={{ fontSize: "11px", textAlign: "center", paddingBottom: "8px" }}
      >
        1 Hour Money-Back Guarantee
      </p>
    </>
  );
};

export default CourseActionInfo;
