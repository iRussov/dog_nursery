import {db} from '../db.js';
import Stripe from 'stripe';


class PaymentController{

    async createPayment(req, res){
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        const { animalId, dogName } = req.body;
        const priceData = await db.oneOrNone(`SELECT price FROM Animals WHERE animal_id = ${animalId}`);
        const price = priceData ? priceData.price : null;

        if (!price) {
            return res.status(404).json({ error: 'Animal not found or price not available' });
        }

        try {
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [{
            price_data: {
            currency: "rub",
            product_data: {
                name: dogName,
            },
            unit_amount: price*100,
            },
            quantity: 1,
        }],
        success_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        cancel_url: `http://localhost:3000/dog/${animalId}`,
        shipping_address_collection: {
            allowed_countries: ['RU'],
        },
        })

        res.json({ url: session.url });
        }catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
        }
    }
}

export default new PaymentController();