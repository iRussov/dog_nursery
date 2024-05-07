import {db} from '../db.js';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

const __dirname = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, 'static/images'));
    },
    filename: (req, file, cb) => {
        const uniqueFilename = Date.now() + '-' + file.originalname;
        cb(null, uniqueFilename);
    },
});

export const upload = multer({ storage });

class AnimalController{
    async getAllAnimals(req, res){
        try{
            const animals = await db.any('SELECT name, image_path, animal_id FROM Animals');
            return res.json(animals);
        }catch(e){
            console.error('Error fetching reviews:', e);
            res.status(500).json({ e: 'Internal Server Error' });
        }
    }
    async getAnimalDetail(req, res){
        try{
            const animalId = req.params.id;
            const animalDetail = await db.one(`SELECT * FROM Animals WHERE animal_id = ${animalId}`);
            return res.json(animalDetail);
        }catch(e){
            console.error('Error fetching reviews:', e);
            res.status(500).json({ e: 'Internal Server Error' });
        }
    }
    async addAnimal(req, res){
        try {
            const { name, age, breed, color, coat_type, gender, price } = req.body;
            const image = req.file;
      
            const imagePath = image ? `/images/${image.filename}` : null;
            await db.none(
                  'INSERT INTO Animals(name, age, breed, color, coat_type, gender, price, image_path) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                  [name, age, breed, color, coat_type, gender, price, imagePath]
              );
      
            res.json({ message: 'Dog add successfully' });
        } catch (error) {
            console.error('Error adding dog:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteAnimal(req, res){
        try {
            const animalId = req.params.id;
      
            const imagePathResult = await db.oneOrNone('SELECT image_path FROM Animals WHERE animal_id = $1', animalId);
            const imagePath = imagePathResult && imagePathResult.image_path;
      
            await db.none('DELETE FROM Animals WHERE animal_id = $1', animalId);
      
            if (imagePath) {
                const imagePathOnDisk = path.join(__dirname, 'static', imagePath);
                fs.unlinkSync(imagePathOnDisk);
            }
      
            res.json({ message: 'Dog deleted successfully' });
        } catch (error) {
            console.error('Error deleting dog:', error);
            res.sendStatus(500);
        }
    }
    async updateAnimal(req, res){
        try {
            const dogId = req.params.id;
            const { name, age, breed, color, coat_type, gender, price} = req.body;
            await db.none(
                  'UPDATE Animals SET name=$1, age=$2, breed=$3, color=$4, coat_type=$5, gender=$6, price=$7 WHERE animal_id=$8',
                  [name, age, breed, color, coat_type, gender, price, dogId]
              );
      
            res.json({ message: 'Dog updated successfully' });
        } catch (error) {
            console.error('Error updating dog:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new AnimalController();