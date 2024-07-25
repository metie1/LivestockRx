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
        const today = new Date();

        // 우선 테스트용으로 두달로 늘려 놓음(2주 x 4 = 8주(56일)), 메인에 표시하는 일정 알림의 끝을 지정
        const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000 * 4);

        console.log('Fetching upcoming vaccinations for user:', userId);
        console.log('Date range:', today, 'to', twoWeeksLater);

        const upcomingVaccinations = await Vaccination.findAll({
            include: [{
                model: Animal,
                as: 'animal',
                attributes: ['tag_number', 'species']
            }],
            where: {
                /*
                date: {
                    [Op.between]: [today, twoWeeksLater]
                },
                */
                // 수정버전
                date: {
                    [Op.between]: [
                        today.toISOString().split('T')[0],
                        twoWeeksLater.toISOString().split('T')[0]
                    ]
                },
                vet_id: userId, // 현재 로그인한 사용자의 ID와 일치하는 데이터만 가져옴
            },
            order: [['date', 'ASC']]
        });


        // 수정버전
        /*
        const upcomingVaccinations = await CalendarEvent.findAll({
            where: {
                user_id: userId,
                event_type: 'vaccination',
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
        */

        console.log('Found upcoming vaccinations:', JSON.stringify(upcomingVaccinations, null, 2));

        
        const formattedVaccinations = upcomingVaccinations.map(vaccination => ({
            id: vaccination.id,
            animalTag: vaccination.animal.tag_number,
            species: vaccination.animal.species,
            vaccineName: vaccination.vaccine_name,
            date: vaccination.date
        }));


        // 수정버전
        /*
        const formattedVaccinations = upcomingVaccinations.map(event => ({
            id: event.id,
            animalTag: event.animal?.tag_number,
            species: event.animal?.species,
            vaccineName: event.title,
            date: event.start
        }));
        */
        
        console.log('Formatted vaccinations:', JSON.stringify(formattedVaccinations, null, 2));
        
        
        console.log('Query parameters:', { userId, today: today.toISOString(), twoWeeksLater: twoWeeksLater.toISOString() });
        console.log('Raw query result:', JSON.stringify(upcomingVaccinations, null, 2));
        console.log('SQL Query:', upcomingVaccinations.toString());
        
        res.json(formattedVaccinations);

        // 수정버전
        /*
        res.json({
            count: formattedVaccinations.length,
            vaccinations: formattedVaccinations
        });
        */
    } catch (error) {
        console.error('Error fetching upcoming vaccinations:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

exports.getAllVaccinations = async (req, res) => {
    try {
        const userId = req.user.id; // 현재 로그인한 사용자의 ID

        const vaccinations = await Vaccination.findAll({
            include: [{
                model: Animal,
                as: 'animal',
                where: { user_id: userId }, // 사용자의 동물만 필터링
                attributes: ['tag_number', 'species']
            }],
            order: [['date', 'DESC']] // 날짜 기준 내림차순 정렬
        });

        // 클라이언트에 보내기 좋은 형태로 데이터 변환
        const formattedVaccinations = vaccinations.map(vac => ({
            id: vac.id,
            animalTag: vac.animal.tag_number,
            species: vac.animal.species,
            vaccineName: vac.vaccine_name,
            date: vac.date
        }));

        res.json(formattedVaccinations);
    } catch (error) {
        console.error('Error fetching vaccinations:', error);
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
};

