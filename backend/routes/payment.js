import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});
