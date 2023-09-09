import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { axiosPublic } from '../../api/apiMethod'
import './Checkout.scss'
import { toast } from 'react-hot-toast'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const Checkout = () => {
    useDocumentTitle(`Checkout - Webdev Skool`)
    const [coursesToPurchase, setCoursesToPurchase] = useState([])
    const [error, setError] = useState("")

    const {currentUser: {fullName, email}} = useSelector(state => state.auth)

    const navigate = useNavigate()
    const {state} = useLocation()
    console.log("checkout courses ===> ", state)

    useEffect(() => {
        if(!state) { //when user will manually navigate to checkout page
            navigate('/cart', {replace: true})
        }else if(state?.length === 1){ //check if there is 1 course to buy
            setCoursesToPurchase(state);
        }else if(state?.length > 1){ 
            setCoursesToPurchase([...new Set([...coursesToPurchase, ...state])])
        }
    }, [state])
    console.log("coursesToPurchase ==>", coursesToPurchase)

    //razorpay window will appear
    const onPaymentHandler = async() => {
        // if(coursesToPurchase.length > 1) {
        //     const orderPromises = coursesToPurchase.map(async (course) => {
        //         // Create a separate order for each course
        //         const { data: { order } } = await axiosPublic.post('/payment/checkout', {
        //           amount: course?.price,
        //           courses: [course],
        //         });
        //         return order;
        //     });
        // }
        
        const {data: {order}} = await axiosPublic.post(`/payment/checkout`, 
        {
            amount: coursesToPurchase.reduce((acc, cv) => acc + cv?.price, 0),
            courses: coursesToPurchase
        })
        console.log("🚋🛵🚖", order)
        const {data: {key}} = await axiosPublic.get(`/payment/getkey`)

        const options = {
            key: key, 
            amount: order.amount, 
            currency: "INR",
            name: "Webdev Skool",
            description: "Course enrollment",
            image: "https://res.cloudinary.com/dh4nb9zjl/image/upload/v1690378768/webdevskool/logo_dlag0p.png",
            order_id: order.id,
            // "callback_url": `http://localhost:5500/api/payment/verification/${coursesToPurchase}`,
            handler: async function (response){
                console.log("res=>", response)
                const {data: {paymentId, courses, status}} = await axiosPublic.post('/payment/verification', {courses: coursesToPurchase, response})
                setCoursesToPurchase([])
                navigate(`/paymentsuccess?reference=${paymentId}`, {replace: true, state: courses})
                if(status !== 'Success'){
                    setError('Something went wrong')
                }
            },
            prefill: {
                name: fullName,
                email: email
            },
            theme: {
                color: "#e65050"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open()
    }   

    //2nd
    // const onPaymentHandler = async () => {
    //     try {
    //       if (coursesToPurchase.length > 1) {
    //         const orderPromises = coursesToPurchase.map(async (course) => {
    //           // Create a separate order for each course
    //           return await axiosPublic.post('/payment/checkout', {
    //             amount: course?.price,
    //             course: [course],
    //           });
    //         });
    //         console.log("order promises ===>", orderPromises)

    //         const orders = await Promise.all(orderPromises);
    //         console.log("🚋🛵🚖", orders); 
      
    //         const { data: { key } } = await axiosPublic.get(`/payment/getkey`);

    //         for (const order of orders) {
    //           const options = {
    //             key: key,
    //             amount: order.amount,
    //             currency: "INR",
    //             name: "Webdev Skool",
    //             description: "Course enrollment",
    //             image: "https://res.cloudinary.com/dh4nb9zjl/image/upload/v1690378768/webdevskool/logo_dlag0p.png",
    //             order_id: order.id,
    //             handler: async function (response){
    //                 console.log("res=>", response)
    //                 const {data: {courses, status}} = await axiosPublic.post('/payment/verification', {
    //                     courses: coursesToPurchase, response
    //                 })
    //                 setCoursesToPurchase([])
    //                 navigate(`/paymentsuccess`, {replace: true, state: courses})
    //                 if(status === 'error'){
    //                     setError('Payment failed, please try again later')
    //                 }
    //             },
    //             prefill: {
    //               name: fullName,
    //               email: email
    //             },
    //             theme: {
    //               color: "#e65050"
    //             }
    //           };
      
    //           const razor = new window.Razorpay(options);
    //           razor.open();
    //         }
    //       }
    //     } catch (error) {
    //       console.error(error);
    //     }
    // };
      
    //3rd
    // const onPaymentHandler = async () => {
    //     try {
    //       if (coursesToPurchase.length > 0) {
    //         const coursesBody = coursesToPurchase.map((course) => ({
    //           course,
    //           response: {},
    //         }));

    //         console.log("🚔🗺🧭", coursesBody)
    //         const { data: { key } } = await axiosPublic.get(`/payment/getkey`);
      
    //         for (const courseObj of coursesBody) {
    //           const { course } = courseObj;
      
    //           const { data: { order } } = await axiosPublic.post('/payment/checkout', {
    //             amount: course?.price,
    //             courses: [course],
    //           });
      
    //           console.log("🚋🛵🚖", order); // This will be the order for the course
      
    //           const options = {
    //             key: key,
    //             amount: order.amount,
    //             currency: "INR",
    //             name: "Webdev Skool",
    //             description: "Course enrollment",
    //             image: "https://res.cloudinary.com/dh4nb9zjl/image/upload/v1690378768/webdevskool/logo_dlag0p.png",
    //             order_id: order.id,
    //             handler: async function (response) {
    //               console.log("res=>", response);
    //               courseObj.response = response; // Store the response for each course
    //             },
    //             prefill: {
    //               name: fullName,
    //               email: email
    //             },
    //             theme: {
    //               color: "#e93369"
    //             }
    //           };
      
    //           const razor = new window.Razorpay(options);
    //           razor.open();
    //         }
      
    //         // After all payments, send coursesBody as the request body to the server
    //         const { data: { courses, status } } = await axiosPublic.post('/payment/verification', { courses: coursesBody });
      
    //         setCoursesToPurchase([]);
    //         navigate(`/paymentsuccess`, { replace: true, state: courses });
      
    //         if (status === 'error') {
    //           setError('Payment failed, please try again later');
    //         }
    //       }
    //     } catch (error) {
    //       console.error(error);
    //     }
    // };
      

  return (
    <>
        {/* <Navbar /> */}
        <div className='checkout-container --flex-center'>
            <div className='checkout-summary'>
                <h1>Summary</h1>
                <div className='space-bw checkout-heading'>
                    <h5>{(coursesToPurchase?.length > 0) && (coursesToPurchase?.length < 2) ? '1 Course' : `${coursesToPurchase?.length} Courses`}</h5>
                    <h5>Total</h5>
                </div>
                <hr />
                <div className='space-bw checkout-courses'>
                    {[...new Set(coursesToPurchase)]?.map((course, index) => (
                        <div className='space-bw checkout-course' key={index}>
                            <p className='course-title'>{course?.title}</p>
                            <p>Rs.{course?.price}</p>
                        </div>
                    ))}
                </div>
                <hr />
                <div className='space-bw checkout-total'>
                    <h2>Total</h2>
                    <p>Rs.{coursesToPurchase.reduce((acc, cv) => acc + cv?.price, 0)}</p>
                </div>
                <button className='button-cart checkout-payment_button' onClick={onPaymentHandler}>Proceed Payment</button>
                {error && <p style={{textAlign: 'center', color: 'red', marginTop: '10px'}}>{error}</p>}
            </div>
        </div>
    </>
  )
}

export default Checkout