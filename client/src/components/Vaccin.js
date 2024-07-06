import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Vaccin.scss';

const Vaccin = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [showCows, setShowCows] = useState(true);
  const [showPigs, setShowPigs] = useState(true);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const { data } = await axios.get('/api/vaccination');
        setVaccinations(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVaccinations();
  }, []);

  const filteredVaccinations = vaccinations.filter(v => 
    (showCows && v.type === '소') || (showPigs && v.type === '돼지')
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
      <table>
        <thead>
          <tr>
            <th>이름(시리얼 번호)</th>
            <th>종류</th>
            <th>현재 예방접종 상태</th>
          </tr>
        </thead>
        <tbody>
          {filteredVaccinations.map(v => (
            <tr key={v.id} className={v.type === '소' ? 'cow-row' : 'pig-row'}>
              <td>{v.serialNumber}</td>
              <td>{v.type}</td>
              <td>{v.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vaccin;
