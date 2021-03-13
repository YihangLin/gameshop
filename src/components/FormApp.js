import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const promise = loadStripe('pk_test_51IPCeuAfgGgouaA6RYiV6GPKHglcz34rcSf2aGomRMLs0xj4huG9MNGoQ0ifBlKYw2EKz13PlQ1xT52LMNNguCPY00Pr0oYZcm');

const FormApp = () => {
  return (
    <Elements stripe={promise}>
      <CheckoutForm />
    </Elements>
  );
}
 
export default FormApp;