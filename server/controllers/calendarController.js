const db = require('../models');
const CalendarEvent = db.CalendarEvent;

exports.createEvent = async (req, res) => {
    try {
        const { title, start, end, backgroundColor, animal_id, event_type } = req.body;
        const event = await CalendarEvent.create({
        title,
        start,
        end,
        backgroundColor,
        animal_id,
        event_type,
        });
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await CalendarEvent.findAll();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};
