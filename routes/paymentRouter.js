import {Router} from 'express';
import controller from  '../controllers/paymentController.js'

const router = new Router();

router.post('/create-payment-intent', controller.createPayment);

export default router;