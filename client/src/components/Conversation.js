import React, { useState, useEffect } from 'react';
import '../styles/Conversation.scss';
import axios from 'axios';

const Conversation = () => {
  const [animalType, setAnimalType] = useState('cow');
  const [tag, setTag] = useState('');
  const [symptoms, setSymptoms] = useState({});
  const [possibleDiseases, setPossibleDiseases] = useState([]);
  const [animalInfo, setAnimalInfo] = useState(null);

  const cowSymptoms = [
    { name: 'fever', label: '발열' },
    { name: 'diarrhea', label: '설사' },
    { name: 'respiratoryDistress', label: '호흡 곤란' },
    { name: 'anorexia', label: '식욕 부진' },
    { name: 'hemorrhage', label: '출혈' },
    { name: 'jaundice', label: '황달' },
    { name: 'nasalDischarge', label: '비강 분비물' },
  ];

  const pigSymptoms = [
    { name: 'fever', label: '발열' },
    { name: 'diarrhea', label: '설사' },
    { name: 'respiratoryDistress', label: '호흡 곤란' },
    { name: 'anorexia', label: '식욕 부진' },
    { name: 'vomiting', label: '구토' },
    { name: 'skinRash', label: '피부 발진' },
  ];

  const diseases = {
    cow: {
      fever: ['브루셀라병', '장독혈증', '만헤이미아 폐렴'],
      diarrhea: ['장독혈증', '살모넬라증'],
      respiratoryDistress: ['만헤이미아 폐렴', '소바이러스성설사'],
      anorexia: ['만헤이미아 폐렴', '장독혈증'],
      hemorrhage: ['장독혈증', '소바이러스성설사'],
      jaundice: ['장독혈증'],
      nasalDischarge: ['만헤이미아 폐렴'],
    },
    pig: {
      fever: ['돼지유행성설사', '돼지인플루엔자', '살모넬라증', '돼지생식기호흡기증후군'],
      diarrhea: ['돼지유행성설사', '대장균성설사', '살모넬라증', '클로스트리디움 디피실 연관 질병'],
      respiratoryDistress: ['돼지인플루엔자', '돼지생식기호흡기증후군'],
      anorexia: ['돼지유행성설사', '돼지인플루엔자'],
      vomiting: ['돼지유행성설사'],
      skinRash: ['톡소플라즈마병'],
    },
  };

  useEffect(() => {
    updatePossibleDiseases();
  }, [symptoms, animalType]);

  const updatePossibleDiseases = () => {
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    const newPossibleDiseases = [...new Set(
      selectedSymptoms.flatMap(symptom => diseases[animalType][symptom] || [])
    )];

    setPossibleDiseases(newPossibleDiseases);
  };

  const handleSymptomChange = (e) => {
    setSymptoms({ ...symptoms, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/health-check', {
        animalType,
        tag,
        symptoms,
      });
      setAnimalInfo(response.data);
    } catch (error) {
      console.error('Error submitting health check:', error);
    }
  };

  return (
    <div className="conversation-form">
      <h2>건강 체크</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            동물 종류:
            <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
              <option value="cow">소</option>
              <option value="pig">돼지</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          {/** 
          <label>
            개체 태그:
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="개체 태그를 입력하세요"
            />
          </label>
          */}
        </div>
        <fieldset className="form-group">
          <legend>증상:</legend>
          {(animalType === 'cow' ? cowSymptoms : pigSymptoms).map((symptom) => (
            <label key={symptom.name} className="checkbox-label">
              <input
                type="checkbox"
                name={symptom.name}
                checked={symptoms[symptom.name] || false}
                onChange={handleSymptomChange}
              />
              {symptom.label}
            </label>
          ))}
        </fieldset>
        <div className="form-buttons">
          {/*<button type="submit" className="submit-button">제출</button>*/}
          <button type="reset" className="reset-button" onClick={() => setSymptoms({})}>초기화</button>
        </div>
      </form>

      {possibleDiseases.length > 0 && (
        <div className="results">
          <h3>가능성 있는 질병:</h3>
          <ul>
            {possibleDiseases.map((disease, index) => (
              <li key={index}>{disease}</li>
            ))}
          </ul>
        </div>
      )}

      {animalInfo && (
        <div className="results">
          <h3>개체 정보:</h3>
          <p>태그: {animalInfo.tag}</p>
          <p>마지막 백신 접종일: {animalInfo.lastVaccinationDate}</p>
          <p>최근 투약 기록: {animalInfo.lastMedication}</p>
        </div>
      )}
    </div>
  );
};

export default Conversation;
