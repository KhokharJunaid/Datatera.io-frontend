import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../components/paymentForm';
import Sidebar from '../../components/sidebar';
import logo from '../../assets/images/logo.jpg';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PULBLIC_KEY);

function Payment() {
  const email = JSON.parse(localStorage.getItem('user'))?.email;

  return (
    <div className="main">
      <div className="sidebar">
        <div className="header">
          <div className="logo_main">
            <u
              className="me-3"
              style={{
                fontSize: '18px',
                textAlign: 'right',
              }}
            >
              {email}
            </u>
            <img src={logo} className="Home_logo" alt="" />
          </div>
          <Sidebar
          // userPlan={userPlan}
          // handleValidatePlan={handleValidatePlan}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                marginTop: '80px',
                width: '100%',
                maxWidth: '500px',
                border: '1px solid gray',
                borderRadius: '10px',
                padding: '15px',
              }}
            >
              <Elements stripe={stripePromise}>
                <PaymentForm selectedPlan={'PLUS'} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
