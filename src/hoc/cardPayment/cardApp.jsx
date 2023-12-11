import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
// import "./App.css";
import axios from "axios";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
let stripeke = process.env.REACT_APP_BASE_SPRIPE_KEY
const stripePromise = loadStripe(stripeke);

export default function CardApp() {
  //const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
     console.log("process.env.REACT_APP_BASE_SPRIPE_KEY",process.env.REACT_APP_BASE_SPRIPE_KEY)
  }, []);

  
  return (
    <div className="App"> 
      {/* {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )} */}
    <Elements stripe={stripePromise}>
       <CheckoutForm />
    </Elements>
    </div>
  );
}