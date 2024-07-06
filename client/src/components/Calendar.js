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
    type: 'cow' // default type
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/calendar/events');
        setEvents(data.map(event => ({
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor: event.backgroundColor,
          className: event.type === '소' ? 'cow-event' : 'pig-event'
        })));
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    setNewEvent({ ...newEvent, date: arg.dateStr });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const { title, start, end, backgroundColor, type } = newEvent;

    if (window.confirm('저장하시겠습니까?')) {
      try {
        const response = await axios.post('/api/calendar/events', {
          title,
          start,
          end,
          backgroundColor,
          type
        });

        if (response.status === 201) {
          setEvents([...events, {
            title,
            start,
            end,
            backgroundColor,
            className: type === 'cow' ? 'cow-event' : 'pig-event'
          }]);
          setNewEvent({ title: '', start: '', end: '', backgroundColor: '', type: 'cow' });
          setShowForm(false);
        }
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const filteredEvents = events.filter(event =>
    (showCows && event.className === 'cow-event') || (showPigs && event.className === 'pig-event')
  );

  return (
    <div>
      <div className="header">
        <div className="switches">
          <label className="switch cow">
            <input type="checkbox" id="cowSwitch" checked={showCows} onChange={() => setShowCows(!showCows)} />
            <span className="slider round"></span>
          </label>
          <label htmlFor="cowSwitch">소</label>
          <label className="switch pig">
            <input type="checkbox" id="pigSwitch" checked={showPigs} onChange={() => setShowPigs(!showPigs)} />
            <span className="slider round"></span>
          </label>
          <label htmlFor="pigSwitch">돼지</label>
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
              type="text"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              placeholder="YYYY-MM-DD"
              readOnly
            />
            <input
              type="text"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
              placeholder="종료 날짜 (선택사항)"
            />
            <input
              type="color"
              name="backgroundColor"
              value={newEvent.backgroundColor}
              onChange={handleInputChange}
              placeholder="배경색 (선택사항)"
            />
            <select name="type" value={newEvent.type} onChange={handleInputChange}>
              <option value="cow">소</option>
              <option value="pig">돼지</option>
            </select>
            <button type="submit" className="submit-button">작성</button>
            <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>취소</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar;
