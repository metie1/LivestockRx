import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Conversation.scss';

const Conversation = () => {
  const [animalType, setAnimalType] = useState('cow');
  const [symptoms, setSymptoms] = useState({});
  const [diagnosisResults, setDiagnosisResults] = useState(null);

  /*
  const cowSymptoms = [
    { name: 'fever', label: '발열' },
    { name: 'diarrhea', label: '설사' },
    { name: 'respiratoryDistress', label: '호흡 곤란' },
    { name: 'anorexia', label: '식욕 부진' },
    { name: 'hemorrhage', label: '출혈' },
    { name: 'jaundice', label: '황달' },
    { name: 'nasalDischarge', label: '비강 분비물' },
    { name: 'weightLoss', label: '체중 감소' },
    { name: 'cough', label: '기침' },
    { name: 'udderInflammation', label: '유방 염증' },
    { name: 'lameness', label: '절뚝거림' },
  ];

  const pigSymptoms = [
    { name: 'fever', label: '발열' },
    { name: 'diarrhea', label: '설사' },
    { name: 'respiratoryDistress', label: '호흡 곤란' },
    { name: 'anorexia', label: '식욕 부진' },
    { name: 'vomiting', label: '구토' },
    { name: 'skinRash', label: '피부 발진' },
    { name: 'cough', label: '기침' },
    { name: 'weightLoss', label: '체중 감소' },
    { name: 'lethargy', label: '무기력' },
    { name: 'jointSwelling', label: '관절 부종' },
    { name: 'nervousSymptoms', label: '신경 증상' },
  ];
  */

  // 수정 버전
  const cowSymptoms = [
    { name: 'fever', label: '발열' },
    { name: 'diarrhea', label: '설사' },
    { name: 'respiratoryDistress', label: '호흡 곤란' },
    { name: 'anorexia', label: '식욕 부진' },
    { name: 'nasalDischarge', label: '콧물' },
    { name: 'cough', label: '기침' },
    { name: 'weightLoss', label: '체중 감소' },
    { name: 'suddenDeath', label: '갑작스러운 죽음' },
    { name: 'bloodyDischarge', label: '혈액이 섞인 분비물' },
    { name: 'weakness', label: '쇠약' },
    { name: 'edema', label: '부종' },
    { name: 'abortion', label: '유산' },
    { name: 'infertility', label: '불임' },
    { name: 'muscleTremors', label: '근육 경련' },
    { name: 'ataxia', label: '운동 실조' },
    { name: 'paralysis', label: '마비' },
    { name: 'jaundice', label: '황달' },
    { name: 'hematuria', label: '혈뇨' },
    { name: 'musclePain', label: '근육통' },
    { name: 'salivation', label: '침 흘림' },
    { name: 'oralUlcer', label: '입안의 궤양' },
    { name: 'dehydration', label: '탈수' },
    { name: 'udderInflammation', label: '유방 염증' },
    { name: 'lameness', label: '절뚝거림' },
    { name: 'decreasedMilkProduction', label: '우유 생산 감소' },
    { name: 'chronicCough', label: '만성 기침' },
    { name: 'lymphadenopathy', label: '림프절 부종' },
    { name: 'conjunctivitis', label: '결막염' },
    { name: 'abdominalPain', label: '복통' },
    { name: 'abdominalDistension', label: '복부 팽만' }
  ];
  
  const pigSymptoms = [
    { name: 'fever', label: '발열' },
    { name: 'diarrhea', label: '설사' },
    { name: 'respiratoryDistress', label: '호흡 곤란' },
    { name: 'anorexia', label: '식욕 부진' },
    { name: 'vomiting', label: '구토' },
    { name: 'skinRash', label: '피부 발진' },
    { name: 'cough', label: '기침' },
    { name: 'weightLoss', label: '체중 감소' },
    { name: 'lethargy', label: '무기력' },
    { name: 'jointSwelling', label: '관절 부종' },
    { name: 'convulsions', label: '경련' },
    { name: 'nasalDischarge', label: '콧물' },
    { name: 'sneezing', label: '재채기' },
    { name: 'bloodyStool', label: '혈변' },
    { name: 'mucoidStool', label: '점액성 변' },
    { name: 'dehydration', label: '탈수' },
    { name: 'vesicles', label: '물집' },
    { name: 'chronicPneumonia', label: '만성 폐렴' },
    { name: 'gastricUlcers', label: '위궤양' },
    { name: 'abdominalPain', label: '복통' },
    { name: 'abortion', label: '유산' },
    { name: 'stillbirth', label: '사산' },
    { name: 'weakPiglets', label: '약한 자돈 출산' },
    { name: 'arthritis', label: '관절염' },
    { name: 'endocarditis', label: '심내막염' },
    { name: 'edema', label: '부종' },
    { name: 'septicemia', label: '패혈증' },
    { name: 'growthDelay', label: '성장 지연' },
    { name: 'meningitis', label: '뇌막염' },
    { name: 'skinSpots', label: '피부 병변' }
  ];

  useEffect(() => {
    if (Object.values(symptoms).some(v => v)) {
      updateDiagnosis();
    }
  }, [symptoms, animalType]);

  const updateDiagnosis = async () => {
    const selectedSymptoms = Object.entries(symptoms)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    try {
      const response = await axios.post('/api/health-check', {
        animalType,
        symptoms: selectedSymptoms
      });
      setDiagnosisResults(response.data);
    } catch (error) {
      console.error('Error diagnosing:', error);
    }
  };

  const handleSymptomChange = (e) => {
    setSymptoms({ ...symptoms, [e.target.name]: e.target.checked });
  };

  return (
    <div className="conversation-container">
      <div className="card input-section">
        <h2>대동물 건강 체크</h2>
        <div className="form-group">
          <label>
            동물 종류:
            <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
              <option value="cow">소</option>
              <option value="pig">돼지</option>
            </select>
          </label>
        </div>
        <div className="symptom-checklist">
          <h3>증상 선택:</h3>
          <div className="symptom-grid">
            {(animalType === 'cow' ? cowSymptoms : pigSymptoms).map((symptom) => (
              <label key={symptom.name} className="checkbox-label">
                <input
                  type="checkbox"
                  name={symptom.name}
                  checked={symptoms[symptom.name] || false}
                  onChange={handleSymptomChange}
                />
                <span className="checkmark"></span>
                {symptom.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      {diagnosisResults && diagnosisResults.diseases && diagnosisResults.diseases.length > 0 && (
        <div className="card results-section">
          <h3>진단 결과</h3>
          <div className="results-container">
            <div className="diseases-list">
              <h4>가능성 있는 질병:</h4>
              <ul>
                {diagnosisResults.diseases.map(({ disease, matchPercentage }, index) => (
                  <li key={index} className="disease-item">
                    <span className="disease-name">{disease}</span>
                    <span className="match-percentage">
                      {matchPercentage.toFixed(1)}% 일치
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {diagnosisResults.medications && diagnosisResults.medications.length > 0 && (
              <div className="medications-list">
                <h4>추천 의약품 (가장 일치하는 질병: {diagnosisResults.topDisease.disease})</h4>
                <ul>
                  {diagnosisResults.medications.map((medication, index) => (
                    <li key={index} className="medication-item">
                      <strong>{medication.품목명}</strong>
                      <p>성분명: {medication.성분명}</p>
                      <p>업체명: {medication.업체명}</p>
                      <p>허가번호: {medication.허가번호}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversation;