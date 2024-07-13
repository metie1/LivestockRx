// controllers/medicationRecordController.js
const { MedicationRecord, Animal, Medication } = require('../models');

exports.createMedicationRecord = async (req, res) => {
    try {
        const { animal_id, medication_id, date, dosage, notes } = req.body;
        const record = await MedicationRecord.create({ animal_id, medication_id, date, dosage, notes });
        res.status(201).json(record);
    } catch (error) {
        console.error('Error creating medication record:', error);
        res.status(500).json({ message: 'Error creating medication record', error: error.message });
    }
};

exports.getMedicationRecords = async (req, res) => {
    try {
        const records = await MedicationRecord.findAll({
            include: [
                { model: Animal, attributes: ['tag_number', 'species'] },
                { model: Medication, attributes: ['품목명'] }
            ]
        });
        res.json(records);
    } catch (error) {
        console.error('Error fetching medication records:', error);
        res.status(500).json({ message: 'Error fetching medication records', error: error.message });
    }
};