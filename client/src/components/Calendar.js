import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/Calendar.scss';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showCows, setShowCows] = useState(true);
  const [showPigs, setShowPigs] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    backgroundColor: '',
    animal_id: '',
    event_type: 'vaccination'
  });
  const [showForm, setShowForm] = useState(false);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchAnimals();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/calendar/events');
      setEvents(response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : null,
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/animals');
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const handleDateClick = (arg) => {
    setNewEvent({ ...newEvent, start: arg.dateStr });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting event:', newEvent);
      const response = await axios.post('http://localhost:5000/api/calendar/events', newEvent);
      console.log('Event created:', response.data);
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error.response?.data || error.message);
    }
  };

  const filteredEvents = events.filter(event =>
    (showCows && event.species === 'cow') || (showPigs && event.species === 'pig')
  );

  return (
    <div>
      <div className="header">
        <div className="switches">
          <label className="switch cow">
            <input type="checkbox" checked={showCows} onChange={() => setShowCows(!showCows)} />
            <span className="slider round"></span>
          </label>
          <label>소</label>
          <label className="switch pig">
            <input type="checkbox" checked={showPigs} onChange={() => setShowPigs(!showPigs)} />
            <span className="slider round"></span>
          </label>
          <label>돼지</label>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={filteredEvents}
          dateClick={handleDateClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          height="auto"
        />
      </div>

      {showForm && (
        <div className="event-form-modal">
          <form className="event-form" onSubmit={handleEventSubmit}>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="일정 내용"
              required
            />
            <input
              type="date"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
            />
            <input
              type="color"
              name="backgroundColor"
              value={newEvent.backgroundColor}
              onChange={handleInputChange}
            />
            <select name="animal_id" value={newEvent.animal_id} onChange={handleInputChange} required>
              <option value="">동물 선택</option>
              {animals.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.tag_number} ({animal.species})
                </option>
              ))}
            </select>
            <select name="event_type" value={newEvent.event_type} onChange={handleInputChange} required>
              <option value="vaccination">예방접종</option>
              <option value="medication">투약</option>
              <option value="checkup">검진</option>
            </select>
            <div>
              <button type="submit" className="submit-button">작성</button>
              <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>취소</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar;