import React from 'react';
import '../styles/Subscribe.scss';

const Subscribe = () => (
  <div>
    <div className="subscription-container">
      <div className="subscription-card">
        <h3>평가판</h3>
        <p>30일 무료 체험</p>
        <button onClick={() => subscribe('trial')}>구독</button>
      </div>
      <div className="subscription-card">
        <h3>1개월</h3>
        <p>월간 구독</p>
        <button onClick={() => subscribe('1month')}>구독</button>
      </div>
      <div className="subscription-card">
        <h3>3개월</h3>
        <p>분기별 구독</p>
        <button onClick={() => subscribe('3months')}>구독</button>
      </div>
      <div className="subscription-card">
        <h3>6개월</h3>
        <p>반기별 구독</p>
        <button onClick={() => subscribe('6months')}>구독</button>
      </div>
    </div>
  </div>
);

const subscribe = (plan) => {
  alert(`${plan} 구독을 선택하셨습니다.`);
};

export default Subscribe;
