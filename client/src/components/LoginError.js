import React from 'react';

const LoginError = () => (
  <div className="container error-container">
    <h2 className="text-center text-danger">로그인 오류</h2>
    <p className="text-center">아이디 또는 비밀번호가 잘못되었습니다. 다시 시도해 주세요.</p>
    <div className="text-center">
      <a href="login" className="btn btn-primary">로그인 페이지로 이동</a>
    </div>
  </div>
);

export default LoginError;