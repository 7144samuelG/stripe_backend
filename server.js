require('dotenv').config()
const stripe = require("stripe")(process.env.SECRET_KEY);
const express = require('express');
const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.get("/",(req,res)=>{
  res.json({"message":"hello there"})
})
app.post('/payment-sheet', async (req, res) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2023-10-16'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx'
  });
});
app.listen(3000, () => {
  console.log('Running on port 3000');
});