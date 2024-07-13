import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { AuthContext } from '../contexts/AuthContext';
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
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext); // user context를 추가로 가져옴

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
      fetchAnimals();
      fetchMedications();
    }
    console.log('Filtered events:', filteredEvents);
  }, [isAuthenticated, showCows, showPigs]);

  const eventContent = (eventInfo) => {
    const event = eventInfo.event;
    const type = event.extendedProps.type;
    let icon = '';
    
    switch (type) {
      case 'vaccine':
        icon = '💉';
        break;
      case 'medication':
        icon = '💊';
        break;
      case 'checkup':
        icon = '🩺';
        break;
      default:
        icon = '📅';
    }

    return (
      <div className={`event-content ${type}`}>
        <span className="event-icon">{icon}</span>
        <span className="event-title">{event.title}</span>
      </div>
    );
  };

  const handleEventRender = (info) => {
    tippy(info.el, {
      content: `
        <strong>${info.event.title}</strong><br>
        시작: ${info.event.start.toLocaleString()}<br>
        ${info.event.end ? `종료: ${info.event.end.toLocaleString()}<br>` : ''}
        유형: ${info.event.extendedProps.type}<br>
        동물: ${info.event.extendedProps.species === 'cow' ? '소' : '돼지'}
      `,
      allowHTML: true,
      animation: 'scale',
    });
  };

  const toggleCows = () => {
    setShowCows(prev => {
      const newShowCows = !prev;
      console.log('Show cows:', newShowCows);
      return newShowCows;
    });
  };

  const togglePigs = () => {
    setShowPigs(prev => {
      const newShowPigs = !prev;
      console.log('Show pigs:', newShowPigs);
      return newShowPigs;
    });
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [vaccineResponse, medicationResponse, calendarResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/vaccinations/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/medication-records', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/calendar/events', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const vaccineEvents = vaccineResponse.data.map(v => ({
        title: `예방접종: ${v.vaccine_name}`,
        start: new Date(v.date),
        backgroundColor: v.animal?.species === 'cow' ? 'blue' : 'pink',
        extendedProps: { type: 'vaccine', species: v.animal?.species },
        animal: { species: v.animal?.species }
      }));
  
      const medicationEvents = medicationResponse.data.map(m => ({
        title: `투약: ${m.Medication?.품목명}`,
        start: new Date(m.date),
        backgroundColor: m.Animal?.species === 'cow' ? 'lightblue' : 'lightpink',
        extendedProps: { type: 'medication', species: m.Animal?.species },
        animal: { species: m.Animal?.species }
      }));
  
      const calendarEvents = calendarResponse.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : null,
        extendedProps: { ...event.extendedProps, species: event.animal?.species },
        animal: { species: event.animal?.species }
      }));
      
      setEvents([...vaccineEvents, ...medicationEvents, ...calendarEvents]);
    } catch (error) {
      console.error('Error fetching events:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        alert('요청한 리소스를 찾을 수 없습니다. 서버 설정을 확인해주세요.');
      } else {
        alert('일정을 불러오는 데 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/animals', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // 로그인한 사용자의 동물만 필터링
      const userAnimals = response.data.filter(animal => animal.user_id === user.id);
      setAnimals(userAnimals);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMedications(response.data);
      setFilteredMedications(response.data); // 초기값 설정
    } catch (error) {
      console.error('Error fetching medications:', error);
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
      const token = localStorage.getItem('token');
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:5000/api/calendar/events/${newEvent.id}`, newEvent, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post('http://localhost:5000/api/calendar/events', newEvent, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowForm(false);
      setIsEditing(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error.response?.data || error.message);
    }
  };

  

  const filteredEvents = events.filter(event => {
    const species = event.animal?.species || event.extendedProps?.species;
    return (showCows && species === 'cow') || (showPigs && species === 'pig') || (!species);
  });

  const handleMedicationSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = medications.filter(med =>
      med.품목명.toLowerCase().includes(searchTerm)
    );
    setFilteredMedications(filtered);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setNewEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      backgroundColor: info.event.backgroundColor,
      animal_id: info.event.extendedProps.animal_id,
      event_type: info.event.extendedProps.type
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:5000/api/calendar/events/${selectedEvent.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setShowForm(false);
        setIsEditing(false);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error.response?.data || error.message);
        alert('일정 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div>
      <div className="header">
        <div className="switches">
          <label className="switch cow">
            <input 
              type="checkbox" 
              checked={showCows} 
              onChange={toggleCows}
            />
            <span className="slider round"></span>
          </label>
          <label>소</label>
          <label className="switch pig">
            <input 
              type="checkbox" 
              checked={showPigs} 
              onChange={togglePigs}
            />
            <span className="slider round"></span>
          </label>
          <label>돼지</label>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          key={filteredEvents.length}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={filteredEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={eventContent}
          eventDidMount={handleEventRender}
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
            <select
              name="animal_id"
              value={newEvent.animal_id}
              onChange={handleInputChange}
              required
            >
              <option value="">동물 선택</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.tag_number} ({animal.species})
                </option>
              ))}
            </select>
            <select 
              name="event_type" 
              value={newEvent.event_type} 
              onChange={handleInputChange} 
              required
            >
              <option value="vaccination">예방접종</option>
              <option value="medication">투약</option>
              <option value="checkup">검진</option>
            </select>
            {newEvent.event_type === 'medication' && (
              <div>
                <input
                  type="text"
                  placeholder="의약품 검색"
                  onChange={handleMedicationSearch}
                />
                <select
                  name="medication_id"
                  value={newEvent.medication_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">의약품 선택</option>
                  {filteredMedications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.품목명}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <button type="submit" className="submit-button">
                {isEditing ? '수정' : '작성'}
              </button>
              {isEditing && (
                <button type="button" className="delete-button" onClick={handleDeleteEvent}>
                  삭제
                </button>
              )}
              <button type="button" className="cancel-button" onClick={() => {
                setShowForm(false);
                setIsEditing(false);
              }}>
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar;
