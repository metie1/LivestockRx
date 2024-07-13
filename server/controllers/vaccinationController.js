const { Vaccination, Animal } = require('../models');
const { Op } = require('sequelize');

exports.createVaccination = async (req, res) => {
    try {
        const { animal_id, vaccine_name, date } = req.body;
        const vaccination = await Vaccination.create({
            animal_id,
            vaccine_name,
            date,
        });
        res.status(201).json(vaccination);
    } catch (error) {
        console.error('Error creating vaccination:', error);
        res.status(500).json({ message: 'Error creating vaccination', error: error.message });
    }
};

exports.getUpcomingVaccinations = async (req, res) => {
    try {
        const userId = req.user.id; // 인증된 사용자의 ID
        console.log('Fetching vaccinations for user ID:', userId);

        const today = new Date();
        const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
        console.log('Date range:', today, 'to', twoWeeksLater);

        const upcomingVaccinations = await Vaccination.findAll({
            include: [{
                model: Animal,
                as: 'animal',
                attributes: ['tag_number', 'species']
            }],
            where: {
                date: {
                    [Op.between]: [today, twoWeeksLater]
                },
                vet_id: userId, // 현재 로그인한 사용자의 ID와 일치하는 데이터만 가져옴
            },
            order: [['date', 'ASC']]
        });

        console.log('Upcoming vaccinations:', JSON.stringify(upcomingVaccinations, null, 2));

        const formattedVaccinations = upcomingVaccinations.map(vaccination => ({
            id: vaccination.id,
            animalTag: vaccination.animal.tag_number,
            species: vaccination.animal.species,
            vaccineName: vaccination.vaccine_name,
            date: vaccination.date
        }));
        
        console.log('Formatted vaccinations:', JSON.stringify(formattedVaccinations, null, 2));
        
        res.json(formattedVaccinations);
    } catch (error) {
        console.error('Error fetching upcoming vaccinations:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

exports.getAllVaccinations = async (req, res) => {
    try {
        const vaccinations = await Vaccination.findAll({
            include: [{
                model: Animal,
                as: 'animal',
                attributes: ['tag_number', 'species']
            }]
        });
        res.json(vaccinations);
    } catch (error) {
        console.error('Error fetching vaccinations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

