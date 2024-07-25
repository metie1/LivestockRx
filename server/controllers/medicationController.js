const { CalendarEvent, Animal, Medication, MedicationRecord } = require('../models');
const { Op } = require('sequelize');

// 수정 버전
exports.getUpcomingMedications = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

        console.log('Fetching upcoming medications for user:', userId);
        console.log('Date range:', today, 'to', twoWeeksLater);

        const upcomingMedications = await CalendarEvent.findAll({
            where: {
                user_id: userId,
                event_type: 'medication',
                start: {
                    [Op.between]: [today, twoWeeksLater]
                }
            },
            include: [{
                model: Animal,
                as: 'animal',
                attributes: ['tag_number', 'species']
            }],
            order: [['start', 'ASC']]
        });

        console.log('Found upcoming medications:', JSON.stringify(upcomingMedications, null, 2));

        const formattedMedications = upcomingMedications.map(event => ({
            id: event.id,
            animalTag: event.animal?.tag_number,
            species: event.animal?.species,
            medicationName: event.title,
            date: event.start
        }));

        console.log('Formatted medications:', JSON.stringify(formattedMedications, null, 2));

        console.log('Entering getUpcomingMedications function');
        console.log('Models available:', Object.keys(require('../models')));

        res.json({
            count: formattedMedications.length,
            medications: formattedMedications
        });
    } catch (error) {
        console.error('Error fetching upcoming medications:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.toString(),
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

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