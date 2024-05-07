import {Router} from 'express';
import controller, { upload } from  '../controllers/animalController.js'

const router = new Router();

router.get('/getAllAnimals', controller.getAllAnimals);
router.get('/getAnimalDetail/:id', controller.getAnimalDetail);
router.post('/addAnimal', upload.single('image'), controller.addAnimal);
router.delete('/deleteAnimal/:id', controller.deleteAnimal);
router.put('/updateAnimal/:id', controller.updateAnimal);
export default router;