const stripe = require('stripe')(process.env.Stripe_Secret_Key);
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const endpointSecret = process.env.Stripe_Webhook_Secret; // Use your actual webhook secret from environment variables

module.exports = app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment was successful!', session);
      break;
    // Add other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});
