import {db} from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const generateJwt = (id, username, role) => {
    return jwt.sign(
        {id, username, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class AuthController{
    async registration(req, res){
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }

            const {username, password} = req.body;
            const existingUser = await db.oneOrNone('SELECT * FROM Users WHERE username = $1', [username]);

            if (existingUser) {
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
            }
            else{
                const hashPassword = await bcrypt.hash(password, 5)

                await db.none('INSERT INTO Users(username, password) VALUES($1, $2)', [username, hashPassword]);
                return res.json({message: "Пользователь успешно зарегистрирован"});
            }

        }catch(e){
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    }
    async login(req, res){
        try{
            const { username, password } = req.body;
            const user = await db.oneOrNone('SELECT * FROM Users WHERE username = $1', username);
            if (!user) {
                return res.status(400).json({message:'Пользователь не найден'})
            }

            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return res.status(400).json({message:'Указан неверный пароль'})
            }

            const token = generateJwt( user.user_id, user.username, user.role);

            res.status(200).json({ token });

        }catch(e){
            console.log(e);
            res.status(400).json({message: 'login error'});
        }
    }
    
}

export default new AuthController();