import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.scss';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer'); // 기본값 설정
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { username, password, email, role });
      console.log('SignUp successful', response.data);
      setError(''); // 오류 메시지 초기화
      localStorage.setItem('token', response.data.token);
      navigate('/'); // 메인 페이지로 리디렉션
    } 
    catch (err) {
      console.error('SignUp error', err);
      setError(err.response.data.error || '회원가입 오류');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-container">
      <h2 className="text-center">회원가입</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">직군</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="farmer">농부</option>
            <option value="vet">수의사</option>
          </select>
        </div>

        {/** 
        <div className="form-group">
          <label htmlFor="birthdate">생일</label>
          <div className="d-flex">
            <input type="number" className="form-control mr-1" id="birthYear" name="birthYear" placeholder="연도" required />
            <input type="number" class="form-control mr-1" id="birthMonth" name="birthMonth" placeholder="월" required />
            <input type="number" class="form-control" id="birthDay" name="birthDay" placeholder="일" required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="residence">거주지</label>
          <input type="text" className="form-control" id="residence" name="residence" required />
        </div>
        */}

        <button type="submit" className="btn btn-primary btn-block">회원가입</button>
      </form>
      )}
    </div>
  );
};

export default SignUp;
