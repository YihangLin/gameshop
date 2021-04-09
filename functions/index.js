const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp();

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

exports.paymentFunc = functions.https.onCall(async(data, context) => {
  const { stripe_id, id } = data;
  const dataRef = admin.firestore().collection('stripe').doc(stripe_id);

  const totalRef = (await dataRef.get()).data().total;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalRef,
      currency: 'usd',
      payment_method: id,
      confirm: true,
    });

    // console.log('Stripe Return: ', paymentIntent);

    return ({
      status: paymentIntent.status
    });
  } catch(error) {
    console.log(error);
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
})