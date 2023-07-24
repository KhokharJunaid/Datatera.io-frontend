import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button } from 'react-bootstrap';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PlansContext } from '../context/plans/plans';

const PaymentForm = ({ selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isCardElementReady, setIsCardElementReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { handleValidatePlan } = useContext(PlansContext);

  const email = JSON.parse(localStorage.getItem('user'))?.email;

  const didMountRef = useRef(false);

  useEffect(() => {
    didMountRef.current = true;
    return () => (didMountRef.current = false);
  }, []);

  useEffect(() => {
    if (didMountRef.current) {
      if (elements && elements.getElement('card')) {
        setIsCardElementReady(true);
      }
    }
  }, [elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = await api.post('/subscription/create', {
        plan: selectedPlan,
        paymentMethodId: paymentMethod.id,
        email,
      });

      console.log('response', response);

      if (response.status === 200) {
        toast('Your package activated successfully', { type: 'success' });
        navigate('/');
        handleValidatePlan();
      }
      // const response = await fetch(
      //   'http://localhost:5000/api/v1/subscription/create',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       plan: selectedPlan,
      //       paymentMethodId: paymentMethod.id,
      //       email: 'malikmusa1997@gmail.com',
      //       customPrice: 34100000, // Replace with the user's email address
      //     }),
      //   },
      // );

      if (!response.data) {
        throw new Error('Error creating subscription');
      }

      setLoading(false);
      // Handle successful subscription, e.g., show a success message
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  const handleCardReady = () => {
    console.log('card ready called!');
    setIsCardElementReady(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h3
          htmlFor="card-element"
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          Credit or debit card
        </h3>
        <br />
        <br />
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            background: 'white',
          }}
        >
          <CardElement id="card-element" onReady={handleCardReady} />
          {!isCardElementReady && <div>Loading...</div>}
        </div>
      </div>
      <br />
      <div>
        <AddressElement
          options={{
            mode: 'billing',
          }}
        />
        <br />
        <Button variant="primary" type="submit" className="submitBtn">
          {loading ? 'Processing...' : 'Subscribe'}
        </Button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default PaymentForm;
