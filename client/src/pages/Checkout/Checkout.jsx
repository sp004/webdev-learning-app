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

    useEffect(() => {
        if(!state) { //when user will manually navigate to checkout page
            navigate('/cart', {replace: true})
        }else if(state?.length === 1){ //check if there is 1 course to buy
            setCoursesToPurchase(state);
        }else if(state?.length > 1){ 
            setCoursesToPurchase([...new Set([...coursesToPurchase, ...state])])
        }
    }, [state])

    //razorpay window will appear
    const onPaymentHandler = async() => {
        const {data: {order}} = await axiosPublic.post(`/payment/checkout`, 
        {
            amount: coursesToPurchase.reduce((acc, cv) => acc + cv?.price, 0),
            courses: coursesToPurchase
        })
        const {data: {key}} = await axiosPublic.get(`/payment/getkey`)

        const options = {
            key: key, 
            amount: order.amount, 
            currency: "INR",
            name: "Webdev Skool",
            description: "Course enrollment",
            image: `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/v1690378768/${process.env.REACT_APP_CLOUDINARY_FOLDER_NAME}/logo_dlag0p.png`,
            order_id: order.id,
            handler: async function (response){
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

  return (
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
  )
}

export default Checkout