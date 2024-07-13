const { Animal, Vaccination, MedicationRecord } = require('../models');

exports.submitHealthCheck = async (req, res) => {
    try {
        const { animalType, tag, symptoms } = req.body;

        // 개체 정보 조회
        const animal = await Animal.findOne({
            where: { tag_number: tag, species: animalType === 'cow' ? 'cow' : 'pig' },
            include: [
                {
                    model: Vaccination,
                    order: [['date', 'DESC']],
                    limit: 1,
                },
                {
                    model: MedicationRecord,
                    order: [['date', 'DESC']],
                    limit: 1,
                }
            ]
        });

        if (!animal) {
            return res.status(404).json({ message: '개체를 찾을 수 없습니다.' });
        }

        // 증상 정보 저장 (옵션)
        // await Symptom.create({ animal_id: animal.id, ...symptoms });

        // 응답 데이터 구성
        const response = {
            tag: animal.tag_number,
            lastVaccinationDate: animal.Vaccinations[0]?.date || '백신 기록 없음',
            lastMedication: animal.MedicationRecords[0]?.medication_name || '투약 기록 없음',
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Health check submission error:', error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
};