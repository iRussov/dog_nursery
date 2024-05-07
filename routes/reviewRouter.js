import Router from 'express';
const router = new Router();
import controller from  '../controllers/reviewController.js'



router.get('/getReviews', controller.getReviews);
router.post('/addReview', controller.addReviews);


export default router;