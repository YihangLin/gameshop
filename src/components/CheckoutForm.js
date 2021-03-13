import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { projectFunctions, projectFirestore } from '../firebase/config';
import firebase from 'firebase/app';

const useStyles = makeStyles((theme) => ({
  form_section: {
    minHeight:'80vh',
    textAlign: 'center',
  },
  pay: {
    margin: '1em',
  }
}));

const CheckoutForm = () => {
  const stripe_id = useParams().sid;
  const user_id = useParams().id;
  let history = useHistory();
  const [price, setPrice] = useState(0);
  const [cardError, setCardError] = useState(null);
  const classes = useStyles();
  const location = useLocation();
  const elements = useElements();
  const stripe = useStripe();
  const [btn, setBtn] = useState(false);
  const [order, setOrder] = useState({});
  const cartDoc = projectFirestore.collection('carts').doc(user_id);
  const ordersDoc = projectFirestore.collection('orders').doc(user_id);
  const stripeDoc = projectFirestore.collection('stripe').doc(stripe_id);

  const cardStyle = {
    style: {
      base: {
        color: '#3443eb',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '18px',
        '::placeholder': {
          color: '#3443eb'
        },
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    },
  };

  useEffect(() => {
    setPrice(location.state.price.total);
    setOrder({
      order: stripe_id,
      games: location.state.games.docs,
      time: Date.now(),
    })
  }, [location, stripe_id])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtn(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });

    if (error) {
      setCardError('Card info incorrect.');
      setBtn(false);
    } else {

      const { id } = paymentMethod;

      // call cloud function
      try {
        const paymentCall = projectFunctions.httpsCallable('paymentFunc');
        paymentCall({
          id: id,
          stripe_id: stripe_id,
        })
        .then((result) => {
          //clear cart after success payment
          if(result.data.status === 'succeeded'){
            setCardError(null);
            cartDoc.update({
              list: [],
              total: 0,
            })
            .then(() => {
              console.log('Cart is now empty.');
            }).catch((error) => {
              console.log('Error removing items from cart: ', error);
            });
            stripeDoc.update({
              paid: true,
            })
            .then(() => {
              console.log('Stripe doc set to paid.');
              history.push('/finish/' + user_id + '/' + stripe_id);
            })
            .catch((error) => {
              console.log('Error setting stripe paid value: ', error);
            });
            ordersDoc.get()
            .then((doc) => {
              //update orders in firestore
              if (doc.exists){
                ordersDoc.update({
                  orders: firebase.firestore.FieldValue.arrayUnion(order),
                })
                .then(() => {
                  console.log('History orders in firestore updated.');
                })
                .catch((error) => {
                  console.log('Error updating history orders in firestore: ', error);
                })
              }else{
                ordersDoc.set({
                  orders: [order]
                })
                .then(() => {
                  console.log('History orders in firestore updated.');
                })
                .catch((error) => {
                  console.log('Error updating history orders in firestore: ', error);
                })
              }
            })
          }
        }).catch((error) => {
          setCardError('Purchase Failed.')
          setBtn(false);
        });
      } catch(error) {
        setCardError('Payment not working properly.')
        setBtn(false);
      };
    }
  }

  return (
    <Grid container spacing={0} direction='column' alignItems='center' justify='center' className={classes.form_section}>
      <Grid item xs={12} sm={4}>
        <form onSubmit={handleSubmit}>
          <h3>BILLING INFORMATION</h3>
          <TextField variant='filled' margin='normal' required fullWidth={true} label='Name'></TextField>
          <TextField variant='filled' margin='normal' type='email' required fullWidth={true} label='Email'></TextField>
          <TextField variant='filled' margin='normal' required fullWidth={true} label='Phone'></TextField>
         
          <h3>PAYMENT</h3>
          <CardElement options={cardStyle} />
          { cardError && (
            <Typography color='error'>{cardError}</Typography>
          ) }
          <Button disabled={btn} variant='contained' type='submit' color='primary' className={classes.pay} size='large'>Pay ${price / 100}</Button>
          { btn && (
            <Typography variant='h6' color='primary'>Processing...</Typography>
          ) }
          <Typography variant='body2'>Test payment: Card#: 4242424242424242, CVC: Any 3 digits, Date: any future date</Typography>
        </form>
      </Grid>
    </Grid>
  );
}
 
export default CheckoutForm;