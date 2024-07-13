import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { FaHeartbeat, FaPills, FaCalendarAlt, FaClipboardList, FaTable, FaCrown } from 'react-icons/fa';
import '../styles/Main.scss';

const Main = () => {
  const [vaccinationAlerts, setVaccinationAlerts] = useState([]);
  const [medicineRecommendations, setMedicineRecommendations] = useState([]);
  const [healthChecklist, setHealthChecklist] = useState([]);
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const token = localStorage.getItem('token');
        const vaccineResponse = await axios.get('http://localhost:5000/api/vaccinations/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched vaccination data:', vaccineResponse.data);
        setVaccinationAlerts(vaccineResponse.data);
      } catch (error) {
        console.error('Error fetching vaccination data:', error);
        if (error.response?.status === 401) {
          logout();
        }
      }
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="main-container">
      <header>
        <h1>대동물 건강 관리의 새로운 기준</h1>
        <p>의약품 검색, 예방 접종 관리, 그리고 맞춤형 Health 케어까지</p>
        {!isAuthenticated && (
          <Link to="/signup" className="cta-button">지금 시작하기</Link>
        )}
      </header>
      <main>
        
      {isAuthenticated && user ? (
        <div>
        <section className="dashboard">
        <h2>안녕하세요, {user.username}님!</h2>
          <div className="summary">
            <div className="summary-item">
              <h3>예방 접종 현황</h3>
              <p>예정된 예방 접종: {vaccinationAlerts.length}건</p>
                <button onClick={fetchData}>새로고침</button>
            </div>
            <div className="summary-item">
              <h3>의약품 사용 현황</h3>
              <p>추천 의약품: {medicineRecommendations.length}건</p>
              <Link to="/medications" className="action-link">상세 보기</Link>
            </div>
          </div>
        </section>
        <section className="alerts">
          <h2>예방 접종 알림</h2>
            <ul>
              {vaccinationAlerts.map((alert, index) => (
                <li key={alert.id || index}>
                  {alert.animalTag} ({alert.species}) - {alert.vaccineName} 접종 예정: {new Date(alert.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
        </section>
        <section className="recommendations">
          <h2>의약품 추천</h2>
          <ul>
            
          </ul>
        </section>

        </div>) :(
          <section className="features">
          <div className="feature-item">
            <FaHeartbeat className="feature-icon" />
            <h3>건강 체크 시스템</h3>
            <p>증상별 설문을 통해 질병을 미리 예측하고 대비하세요.</p>
          </div>
          <div className="feature-item">
            <FaPills className="feature-icon" />
            <h3>의약품 정보 제공</h3>
            <p>업체, 성분, 의약품 이름 등 상세한 정보를 쉽게 확인하세요.</p>
          </div>
          <div className="feature-item">
            <FaCalendarAlt className="feature-icon" />
            <h3>예방 접종 및 의약 기록 관리</h3>
            <p>캘린더 형식으로 소, 돼지 등 가축별 접종 기록을 한눈에 파악하세요.</p>
          </div>
          <div className="feature-item">
            <FaClipboardList className="feature-icon" />
            <h3>개체별 상세 정보</h3>
            <p>체중, 접종 기록, 생년월일 등 각 개체의 모든 정보를 체계적으로 관리하세요.</p>
          </div>
          <div className="feature-item">
            <FaTable className="feature-icon" />
            <h3>의약 사용 기록 표</h3>
            <p>표 형식으로 정리된 의약 사용 기록으로 효율적인 건강 관리를 경험하세요.</p>
          </div>
          <div className="feature-item">
            <FaCrown className="feature-icon" />
            <h3>구독 시스템</h3>
            <p>정기 구독으로 더 많은 프리미엄 기능을 이용해보세요.</p>
          </div>
        </section>
        )}
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
