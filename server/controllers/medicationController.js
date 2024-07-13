// controllers/medicationController.js
const { Medication, MedicationRecord, Animal } = require('../models');

exports.getAllMedications = async (req, res) => {
    console.log('getAllMedications function called');
    try {
        console.log('Fetching all medications...');
        const medications = await Medication.findAll();

        console.log('Medications fetched:', medications.length);
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ message: 'Error fetching medications', error: error.toString() });
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


/*
exports.getMedicationDetails = async (req, res) => {
    try {
        const medication = await Medication.findByPk(req.params.id);
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        res.json(medication);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medication details', error: error.message });
    }
};

exports.addMedicationRecord = async (req, res) => {
    try {
        const { animal_id, medication_id, date, dosage, notes } = req.body;
        const record = await MedicationRecord.create({ animal_id, medication_id, date, dosage, notes });
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Error adding medication record', error: error.message });
    }
};
*/