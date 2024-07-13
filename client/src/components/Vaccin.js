import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Vaccin.scss';

const Vaccin = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [showCows, setShowCows] = useState(true);
  const [showPigs, setShowPigs] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/vaccinations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVaccinations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vaccinations:', error);
        setError('예방접종 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };
    fetchVaccinations();
  }, []);

  const filteredVaccinations = vaccinations.filter(v => 
    (showCows && v.animal.species === 'cow') || (showPigs && v.animal.species === 'pig')
  );

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="vaccin-container">
      <h1 className="vaccin-title">예방접종 기록</h1>
      <div className="filters">
        <label className="switch">
          <input 
            type="checkbox" 
            checked={showCows} 
            onChange={() => setShowCows(!showCows)}
          />
          <span className="slider"></span>
          <span className="label">소</span>
        </label>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={showPigs} 
            onChange={() => setShowPigs(!showPigs)}
          />
          <span className="slider"></span>
          <span className="label">돼지</span>
        </label>
      </div>
      {filteredVaccinations.length > 0 ? (
        <div className="table-container">
          <table className="vaccin-table">
            <thead>
              <tr>
                <th>태그 번호</th>
                <th>종류</th>
                <th>백신 이름</th>
                <th>접종일</th>
              </tr>
            </thead>
            <tbody>
              {filteredVaccinations.map(v => (
                <tr key={v.id} className={v.animal.species === 'cow' ? 'cow-row' : 'pig-row'}>
                  <td>{v.animal.tag_number}</td>
                  <td>{v.animal.species === 'cow' ? '소' : '돼지'}</td>
                  <td>{v.vaccine_name}</td>
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">표시할 예방접종 기록이 없습니다.</p>
      )}
    </div>
  );
};

export default Vaccin;