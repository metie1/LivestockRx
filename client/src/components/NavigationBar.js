import React, { useContext } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/NavigationBar.scss';

const NavigationBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="logo">
      <Link to="/" className="logo-link">
          <span className="logo-text">Livestock</span>
          <span className="logo-highlight">Rx</span>
        </Link>
      </div>

      <div className="menu" >
        <NavLink to="/conversation" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>대동물 Health</NavLink>
        <NavLink to="/MedicationInfo" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>의약품 정보</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>캘린더</NavLink>
        <NavLink to="/vaccin" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>예방접종 기록</NavLink>
        <NavLink to="/animals" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>개체 목록</NavLink>
        <NavLink to="/subscribe" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>구독</NavLink>
      </div>

      <div className="auth">
        {isAuthenticated ? (
          <>
            <NavLink to="/mypage" className="auth-button mypage-button">마이페이지</NavLink>
            <button onClick={handleLogout} className="auth-button logout-button">로그아웃</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="auth-button login-button">로그인</NavLink>
            <NavLink to="/signup" className="auth-button signup-button">회원가입</NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;