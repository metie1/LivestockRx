import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavigationBar.scss';

const NavigationBar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">LivestockRx</Link>
      </div>
      <div className="menu">
        <Link to="/conversation">대동물 Health</Link>
        <Link to="/calendar">캘린더</Link>
        <Link to="/vaccin">예방접종 기록</Link>
        <Link to="/subscribe">구독</Link>
      </div>
      <div className="auth">
        <Link to="/login" className="login-button">로그인</Link>
        <Link to="/signup" className="signup-button">회원가입</Link>
      </div>
    </div>
  );
};

export default NavigationBar;
