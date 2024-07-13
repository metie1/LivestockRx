const { CalendarEvent, Animal, Vaccination } = require('../models');

exports.createEvent = async (req, res) => {
    try {
        console.log('Received event data:', req.body);
        const { title, start, end, backgroundColor, animal_id, event_type, medication_id } = req.body;
        const user_id = req.user.id;  // JWT에서 추출한 사용자 ID
        
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
            event_type,
            user_id
        });
        
        // If the event type is 'medication', create a record in the Vaccinations table
        if (event_type === 'medication') {
            console.log('Creating vaccination record');
            await Vaccination.create({
                animal_id,
                vaccine_name: title,
                date: start,
                vet_id: user_id,
                type: event_type
            });
            console.log('Vaccination record created');
        }
        
        const eventWithAnimal = await CalendarEvent.findByPk(event.id, {
            include: [{
                model: Animal,
                as: 'animal',
                attributes: ['id', 'species']
            }]
        });

        // res.status(201).json(event); // 생성된 일정 정보를 응답으로 보냄
        res.status(201).json(eventWithAnimal);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        console.log('User from request:', req.user); // req.user 로깅
        const user_id = req.user.id; // req.user에서 id 추출
        
        const events = await CalendarEvent.findAll({
            where: { user_id },  // 현재 로그인한 사용자의 일정만 가져옴

            include: [{
                model: Animal,
                as: 'animal',
                attributes: ['id', 'species']
            }]
        });

        console.log('Retrieved events:', events); // 검색된 이벤트 로깅
        res.status(200).json(events);
    } 
    catch (error) {
        console.error('Error fetching events:', error);

        res.status(500).json({ 
            message: 'Error fetching events', 
            error: error.toString(),
            stack: error.stack // 스택 트레이스 포함
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, start, end, backgroundColor, animal_id, event_type } = req.body;

        const event = await CalendarEvent.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.update({
            title,
            start,
            end,
            backgroundColor,
            animal_id,
            event_type
        });

        const updatedEvent = await CalendarEvent.findByPk(id, {
            include: [{
                model: Animal,
                as: 'animal',
                attributes: ['id', 'species']
            }]
        });

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting event with id:', id);  // 디버깅을 위한 로그 추가
    
        const event = await CalendarEvent.findByPk(id);
        if (!event) {
            console.log('Event not found');  // 디버깅을 위한 로그 추가
            return res.status(404).json({ message: 'Event not found' });
        }

        // 이벤트가 medication 타입인 경우 Vaccination 레코드도 삭제
        if (event.event_type === 'medication') {
            await Vaccination.destroy({
                where: {
                    animal_id: event.animal_id,
                    date: event.start,
                    vaccine_name: event.title
                }
            });
            console.log('Associated Vaccination record deleted');
        }
    
        await event.destroy();
        console.log('Event deleted successfully');  // 디버깅을 위한 로그 추가
    
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};