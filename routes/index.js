import {Router} from 'express';
import authRouter from './authRouter.js';
import reviewRouter from './reviewRouter.js';
import animalRouter from './animalRouter.js';
import mediclaRecordsRouter from './medicalRecordRouter.js';
import paymentRouter from './paymentRouter.js';

const router = new Router();
router.use('/auth', authRouter);
router.use('/review', reviewRouter);
router.use('/animal', animalRouter);
router.use('/medicalRecords', mediclaRecordsRouter);
router.use('/payment', paymentRouter);

export default router;