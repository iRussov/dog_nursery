import {db} from '../db.js';

class ReviewController{
    async getReviews(req, res){
        try{
            const reviews = await db.any('SELECT * FROM reviews');
            return res.json(reviews);
        }catch(e){
            console.error('Error fetching reviews:', e);
            res.status(500).json({ e: 'Internal Server Error' });
        }
    }
    async addReviews(req, res){
        try{
            const { user_name, review_type, review_text } = req.body;
            const ispositive = parseInt(review_type) === 1 ? true : false; 
            await db.none('INSERT INTO reviews(user_name, ispositive, review) VALUES($1, $2, $3)', [user_name, ispositive, review_text]);

            return res.json({message: 'отзыв оставлен'});
        }catch(e){
            console.error('Error fetching reviews:', e);
            res.status(500).json({ e: 'Internal Server Error' });
        }
    }
}

export default new ReviewController();