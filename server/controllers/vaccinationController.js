const { Vaccination, CalendarEvent } = require('../models');

exports.getAllVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.findAll();
    res.json(vaccinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addVaccination = async (req, res) => {
  const { animal_id, vaccine_name, date, vet_id } = req.body;

  try {
    const vaccination = await Vaccination.create({ animal_id, vaccine_name, date, vet_id });
    await CalendarEvent.create({
      animal_id,
      event_type: 'vaccination',
      event_name: vaccine_name,
      event_date: date,
    });
    res.status(201).json(vaccination);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
