const Animal = require('../models/Animal');

const getAnimalDetail = async (req, res) => {
  const { id } = req.params;
  
  try {
    const animal = await Animal.findOne({ where: { serialNumber: id } });
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    res.status(200).json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAnimalDetail };
