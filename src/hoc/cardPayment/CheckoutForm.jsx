import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
const totalPrice = 1400; //this means 12 usd and it should be calculated from the items or in the backend

export default function CheckoutForm() {
    const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();
const history = useNavigate()
  // create a payment intent
  useEffect(() => {
   // setClientSecret("sk_test_51NJU1YSHwYY3jHSOyIO4AlGX6juNcXxhfXEN6yUIJMzzoi1UNcaLnhND8OZqYQOUhs2CNd3iqKmaiSzrXjzU0eDF00zjE5mC6f");
  //  fetch("http://localhost:3001/create-payment-intent", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ price: totalPrice }),
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setClientSecret(data.clientSecret);
  //     });
  // axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
  // //axios.defaults.headers.common['Authorization'] = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5pa2FudGFyZWRkeS5zaXh0aGJsb2NrQGdtYWlsLmNvbSIsImV4cCI6MTY4NjkyMDkzNiwiaWF0IjoxNjg2NzQwOTM2fQ.T-OIpM0wvcHQGFvOv-EWmsdXNO8uw4N5v2PI0e630J_H1fCrdpfchgatMgub8GOQ23_hrcztou3dlkfk-HjROA";
  // axios.post(`${process.env.REACT_APP_BASE_URL}/stripeCustomer/90/createPaymentIntent`,{}).then((res)=>{
  //       console.log("res",res);
          let clientSecr = localStorage.getItem('clientSecret');
         setClientSecret(clientSecr);
  //     }).catch((err)=>{
  //       console.log("err",err);
  //     })
     
   
  }, []);
  const cardStyle = {
    style: {},
  };

  // handle input errors
  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      toast.success("Card payment complated", { theme: "colored" })
      setTimeout(() => {
        history("/studentTabs/2");
      }, 1000);
    }
  };
  return (
    <>
    <ToastContainer />  
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement
        id="card-element"
        options={cardStyle}
        onChange={handleChange}
      />
      <button disabled={processing || disabled || succeeded} id="submit">
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment succeeded, see the result in your
        <a href={`https://dashboard.stripe.com/test/payments`}>
          {" "}
          Stripe dashboard.
        </a>{" "}
        Refresh the page to pay again.
      </p> */}
    </form>
    </>
    
  );
};
