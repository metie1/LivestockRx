const Vaccination = require('../models/Vaccination');

const getVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.findAll();
    res.status(200).json(vaccinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getVaccinations };
