import {db} from '../db.js';

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear() % 100; 
  
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;
  
    return `${formattedDay}.${formattedMonth}.${year}`;
  }

class medicalRecordController{
    async getMedicalRecords(req, res){
        try {
            const animalId = req.params.id;
            const medicalRecords = await db.oneOrNone(`SELECT * FROM medical_records where animal_id = ${animalId}`);
            if(medicalRecords){
              {medicalRecords.date = formatDate(medicalRecords.date)}
            }    
            return res.json(medicalRecords);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateMedicalRecords(req, res){
        try {
            const { animalId, medicalStatus, vaccinations, date} = req.body;
            const existingRecord = await db.oneOrNone('SELECT * FROM medical_records WHERE animal_id = $1', [animalId]);
      
            if (existingRecord) {
                await db.none(
                    'UPDATE medical_records SET health_status=$1, vaccinations=$2, date = $3 WHERE animal_id=$4',
                    [medicalStatus, vaccinations, date, animalId]
                );
            } else {
                await db.none(
                    'INSERT INTO medical_records (animal_id, health_status, vaccinations, date) VALUES ($1, $2, $3, $4)',
                    [animalId, medicalStatus, vaccinations, date]
                );
            }
            res.json({ message: 'records updated successfully' });
        } catch (error) {
            console.error('Error updating records:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new medicalRecordController();