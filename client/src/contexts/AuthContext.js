import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) { // 토큰이 만료되었으면 로그아웃
        logout();
      }

    }
  };

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // 1분마다 체크
    return () => clearInterval(interval);
    
    /*
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      console.log('User authenticated with token:', token); // 디버깅용
    }

    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // 오류 발생 시 로컬 스토리지의 데이터를 초기화
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    */
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    console.log('User logged in, token saved:', token); // 디버깅용

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    console.log('User logged out, token removed'); // 디버깅용

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};