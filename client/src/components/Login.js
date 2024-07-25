import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Login.scss';
import LoginError from './LoginError';

const Login = () => {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', credentials);
      // const { token } = response.data;

      // localStorage.setItem('token', token);
      // console.log('Login response:', token); // 응답 로그 추가, 디버깅용

      login(response.data.token, response.data.user);

      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // setError(''); // 오류 메시지 초기화
      navigate('/'); // 메인 페이지로 리디렉션

      setLoginError(false); // 로그인 성공 시 오류 상태를 false로 설정
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error occurred');
      
      // setLoginError(true); // 로그인 오류 발생 시 오류 상태를 true로 설정
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container form-container">
      <h2 className="text-center">로그인</h2>
        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">아이디</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
              {isLoading ? 'Logging in...' : 'Login'}
            </button> 
          </form>
        )}
    </div>
  );
};

export default Login;
