import Router from 'express';
const router = new Router();
import controller from  '../controllers/authController.js'
import {check} from 'express-validator';



router.post('/register', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 символов").isLength({min:4})
], controller.registration);
router.post('/login', controller.login);


export default router;