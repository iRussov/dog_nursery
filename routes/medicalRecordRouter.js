import {Router} from 'express';
import controller from  '../controllers/medicalRecordController.js'

const router = new Router();

router.get('/getMedicalRecords/:id', controller.getMedicalRecords);
router.put('/updateMedicalRecords', controller.updateMedicalRecords);

export default router;