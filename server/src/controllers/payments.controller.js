const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_xxxxx');

const createIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return res.json({
      success: true,
      message: 'Payment intent created',
      data: { clientSecret: paymentIntent.client_secret, id: paymentIntent.id },
    });
  } catch (error) {
    return next(error);
  }
};

const webhook = async (req, res) => res.json({ success: true, message: 'Webhook endpoint active' });

module.exports = { createIntent, webhook };
