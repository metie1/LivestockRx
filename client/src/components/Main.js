import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Main.scss';

const Main = () => {
  const [vaccinationAlerts, setVaccinationAlerts] = useState([]);
  const [medicineRecommendations, setMedicineRecommendations] = useState([]);
  const [healthChecklist, setHealthChecklist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vaccineResponse = await axios.get('http://localhost:5000/api/vaccinations/upcoming');
        setVaccinationAlerts(vaccineResponse.data);

        const medicineResponse = await axios.get('http://localhost:5000/api/medicine/recommendations');
        setMedicineRecommendations(medicineResponse.data);

        const checklistResponse = await axios.get('http://localhost:5000/api/health/checklist');
        setHealthChecklist(checklistResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="main-container">
      <header>
        <h1>LivestockRx</h1>
      </header>
      <main>
        <section className="dashboard">
          <h2>대시보드</h2>
          <div className="summary">
            <div className="summary-item">
              <h3>예방 접종 현황</h3>
              <p>예정된 예방 접종: {vaccinationAlerts.length}건</p>
            </div>
            <div className="summary-item">
              <h3>의약품 사용 현황</h3>
              <p>추천 의약품: {medicineRecommendations.length}건</p>
            </div>
          </div>
        </section>
        <section className="alerts">
          <h2>예방 접종 알림</h2>
          <ul>
            {vaccinationAlerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </section>
        <section className="recommendations">
          <h2>의약품 추천</h2>
          <ul>
            {medicineRecommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </section>
        <section className="checklist">
          <h2>건강 체크리스트</h2>
          <ul>
            {healthChecklist.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 LivestockRx. All rights reserved.</p>
        <nav>
          <a href="/privacy">개인정보 처리방침</a>
          <a href="/terms">이용 약관</a>
          <a href="/contact">문의처</a>
        </nav>
      </footer>
    </div>
  );
};

export default Main;
