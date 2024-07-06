import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss';
import LoginError from './LoginError';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      console.log('Login successful', response.data);
      setLoginError(false); // 로그인 성공 시 오류 상태를 false로 설정
      localStorage.setItem('token', response.data.token);
      setError(''); // 오류 메시지 초기화
      navigate('/'); // 메인 페이지로 리디렉션
    } catch (err) {
      console.error('Login error', err);
      setError('로그인 실패: 아이디나 비밀번호를 확인하세요.');
      setLoginError(true); // 로그인 오류 발생 시 오류 상태를 true로 설정
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-container">
      <h2 className="text-center">로그인</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">아이디</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-block">로그인</button>
          </form>
        )}
    </div>
  );
};

export default Login;
