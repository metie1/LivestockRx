const { Animal, Vaccination, MedicationRecord } = require('../models');

exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.findAll();
    res.json(animals);
  } 
  catch (error) {
    console.error('Error fetching all animals:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
};

exports.getMyAnimals = async (req, res) => {
  try {
      const user_id = req.user.id;  // JWT에서 추출한 사용자 ID
      const animals = await Animal.findAll({
          where: { user_id },
      });
      res.json(animals);
  } catch (error) {
      console.error('Error fetching my animals:', error);
      res.status(500).json({ message: 'Error fetching my animals', error: error.message });
  }
};

exports.getAnimalDetails = async (req, res) => {
    try {
        const animalId = req.params.id;
        console.log(`Fetching details for animal with id: ${animalId}`);
        
        const animal = await Animal.findByPk(animalId, {
          include: [
              { model: Vaccination, as: 'vaccinations' },
              { model: MedicationRecord, as: 'medicationRecords' }
          ]
      });

        if (!animal) {
            console.log(`Fetching details for animal with id: ${animalId}`);
            return res.status(404).json({ message: '개체를 찾을 수 없습니다.' });
        }

        // 나이 계산
        // const age = animal.birth_date ? Math.floor((new Date() - new Date(animal.birth_date)) / (365.25 * 24 * 60 * 60 * 1000)) : null;

        console.log(`Animal found:`, JSON.stringify(animal, null, 2));

        res.json({
            ...animal.toJSON(),
            // age
        });
    } catch (error) {
        console.error('Error fetching animal details:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
};

exports.createAnimal = async (req, res) => {
    try {
        const { tag_number, species, gender, birth_date, weight } = req.body;
        const user_id = req.user.id;  // JWT에서 추출한 사용자 ID
        const animal = await Animal.create({
            tag_number,
            species,
            gender,
            birth_date,
            weight,
            user_id
        });
        res.status(201).json(animal);
    } catch (error) {
        console.error('Error creating animal:', error);
        res.status(500).json({ message: 'Error creating animal', error: error.message });
    }
};