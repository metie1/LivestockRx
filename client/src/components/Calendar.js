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
import MedicationSelector from './MedicationSelector';

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
    event_type: '' // 
  });
  const [showForm, setShowForm] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext); // user context를 추가로 가져옴
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [errors, setErrors] = useState({}) // 추가

  // 추가
  const validateForm = () => {
    const newErrors = {};
    if (!newEvent.title.trim()) newErrors.title = '일정 내용을 입력해주세요.';
    if (!newEvent.start) newErrors.start = '시작일을 선택해주세요.';
    if (!newEvent.animal_id) newErrors.animal_id = '동물을 선택해주세요.';
    if (!newEvent.event_type) newErrors.event_type = '이벤트 유형을 선택해주세요.';
    if (newEvent.event_type === 'medication' && !newEvent.medication_id) {
      newErrors.medication_id = '의약품을 선택해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
    if (medication) {
      setNewEvent(prev => ({
        ...prev,
        title: `투약: ${medication.품목명}`,
        medication_id: medication.id
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        title: '',
        medication_id: ''
      }));
    }
  };    

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
      case 'vaccination':
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
      {/** 
      {type === 'medication' && event.extendedProps.medicationName && (
        <div className="medication-name">투약: {event.extendedProps.medicationName}</div>
      )}
      */}
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
        axios.get('/api/vaccinations/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/medication-records', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/calendar/events', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const vaccineEvents = vaccineResponse.data.map(v => ({
        title: `예방접종`,
        start: new Date(v.date),
        backgroundColor: v.animal?.species === 'cow' ? 'brown' : 'pink',
        extendedProps: { type: 'vaccination', species: v.animal?.species },
        animal: { species: v.animal?.species }
      }));
  
      const medicationEvents = medicationResponse.data.map(m => ({
        title: '투약', // : ${m.Medication?.품목명}`
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


      // 수정버전
      /*
      const calendarResponse = await axios.get('http://localhost:5000/api/calendar/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const calendarEvents = calendarResponse.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: event.end ? new Date(event.end) : null,
        extendedProps: { 
          type: event.event_type, 
          species: event.animal?.species,
          medicationName: event.medication_name  // 추가
        },
        animal: { species: event.animal?.species }
      }));
      
      setEvents(calendarEvents);
      */
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
      const response = await axios.get('/api/animals', {
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
      const response = await axios.get('/api/medications', {
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


    // 수정버전
    /*
    const { name, value } = e.target;
    if (name === 'medication_id' && newEvent.event_type === 'medication') {
      const selectedMedication = filteredMedications.find(med => med.id === parseInt(value));
      if (selectedMedication) {
        setNewEvent(prev => ({
          ...prev,
          [name]: value,
          title: `투약: ${selectedMedication.품목명}`
        }));
      }
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
    */
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    // 추가
    if (!validateForm()) return;

    if (!newEvent.event_type) {
      alert('이벤트 타입을 선택해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // 본버전
      
      let response;
      if (isEditing) {
        response = await axios.put(`/api/calendar/events/${newEvent.id}`, newEvent, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post('/api/calendar/events', newEvent, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      

      // 수정버전 
      /*
      let eventTitle = newEvent.title;

      if (newEvent.event_type === 'medication' && newEvent.medication_id) {
        const selectedMedication = filteredMedications.find(med => med.id === parseInt(newEvent.medication_id));
        if (selectedMedication) {
          eventTitle = `투약: ${selectedMedication.품목명}`;
        }
      }

      const eventData = {
        ...newEvent,
        title: eventTitle
      };

      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:5000/api/calendar/events/${newEvent.id}`, eventData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post('http://localhost:5000/api/calendar/events', eventData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      */

      // 수정버전 2
      /*
      let eventData = { ...newEvent };

      if (newEvent.event_type === 'medication' && newEvent.medication_id) {
        const selectedMedication = filteredMedications.find(med => med.id === parseInt(newEvent.medication_id));
        if (selectedMedication) {
          eventData.medication_name = selectedMedication.품목명;
        }
      }
  
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:5000/api/calendar/events/${newEvent.id}`, eventData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post('http://localhost:5000/api/calendar/events', eventData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      */

      setShowForm(false);
      setIsEditing(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error.response?.data || error.message);
      alert('일정 저장에 실패했습니다. 다시 시도해 주세요. ');
      alert(`오류: ${error.response?.data?.message || error.message}`);
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

    console.log(info.event.extendedProps.type);
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      try {
        console.log('Deleting event with ID:', selectedEvent.id); // 로그 추가
        await axios.delete(`/api/calendar/events/${selectedEvent.id}`, {
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

  // 추가
  const handleEventChange = async (changeInfo) => {
    try {
      const token = localStorage.getItem('token');
      const updatedEvent = {
        id: changeInfo.event.id,
        start: changeInfo.event.start,
        end: changeInfo.event.end || null,
        title: changeInfo.event.title,
        event_type: changeInfo.event.extendedProps.type,
        animal_id: changeInfo.event.extendedProps.animal_id,
        backgroundColor: changeInfo.event.backgroundColor
      };
  
      await axios.put(`/api/calendar/events/${updatedEvent.id}`, updatedEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // 이벤트가 성공적으로 업데이트되면 서버에서 최신 데이터를 다시 가져옵니다.
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('일정 업데이트에 실패했습니다.');
      changeInfo.revert(); // 변경을 되돌립니다.
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
          height="calc(100vh - 150px)"  // 화면 높이에서 상단 네비게이션 바 높이를 뺀 값
          contentHeight="auto"
          aspectRatio={1.35}  // 이 값을 조정하여 캘린더의 비율을 조절할 수 있습니다
        
          // 추가
          eventChange={handleEventChange}
        />
      </div>

      {showForm && (
        <div className="event-form-modal" role="dialog" aria-labelledby="event-form-title">
        <form className="event-form" onSubmit={handleEventSubmit}>
          <h2 id="event-form-title">{isEditing ? '일정 수정' : '새 일정 추가'}</h2>
          <div className="form-group">
            <label htmlFor="event-title">일정 내용</label>
            <input
              id="event-title"
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby="title-error"
            />
            {errors.title && <span id="title-error" className="error-message">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="event-start">시작일</label>
            <input
              id="event-start"
              type="date"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              aria-invalid={errors.start ? "true" : "false"}
              aria-describedby="start-error"
            />
            {errors.start && <span id="start-error" className="error-message">{errors.start}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="event-end">종료일</label>
            <input
              id="event-end"
              type="date"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-animal">동물 선택</label>
            <select
              id="event-animal"
              name="animal_id"
              value={newEvent.animal_id}
              onChange={handleInputChange}
              aria-invalid={errors.animal_id ? "true" : "false"}
              aria-describedby="animal-error"
            >
              <option value="">동물 선택</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.tag_number} ({animal.species})
                </option>
              ))}
            </select>
            {errors.animal_id && <span id="animal-error" className="error-message">{errors.animal_id}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="event-type">이벤트 유형</label>
            <select 
              id="event-type"
              name="event_type" 
              value={newEvent.event_type} 
              onChange={handleInputChange}
              aria-invalid={errors.event_type ? "true" : "false"}
              aria-describedby="event-type-error"
            >
              <option value="">이벤트 유형 선택</option>
              <option value="vaccination">예방접종</option>
              <option value="medication">투약</option>
              <option value="checkup">검진</option>
            </select>
            {errors.event_type && <span id="event-type-error" className="error-message">{errors.event_type}</span>}
          </div>
          
          {newEvent.event_type === 'medication' && (
            <div className="form-group">
              <MedicationSelector
                medications={medications}
                onSelect={handleMedicationSelect}
                error={errors.medication_id}
              />
            </div>
          )}
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? '수정' : '추가'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-danger" onClick={handleDeleteEvent}>
                삭제
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={() => {
              setShowForm(false);
              setIsEditing(false);
              setErrors({});
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