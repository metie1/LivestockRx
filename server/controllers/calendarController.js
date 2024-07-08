const { CalendarEvent, Animal } = require('../models');

exports.createEvent = async (req, res) => {
    try {
        console.log('Received event data:', req.body);
        const { title, start, end, backgroundColor, animal_id, event_type } = req.body;
        
        // Check if the animal exists
        const animal = await Animal.findByPk(animal_id);
        if (!animal) {
        return res.status(400).json({ message: 'Invalid animal_id' });
        }

        const event = await CalendarEvent.create({
        title,
        start,
        end,
        backgroundColor,
        animal_id,
        event_type
        });
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await CalendarEvent.findAll({
        include: [{
            model: Animal,
            as: 'animal',
            attributes: ['species']
        }]
        });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};