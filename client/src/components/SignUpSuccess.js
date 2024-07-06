import React from 'react';

const SignUpSuccess = () => (
  <div className="container success-container">
    <h2 className="text-center text-success">회원가입 성공</h2>
    <p className="text-center">회원가입이 성공적으로 완료되었습니다.</p>
    <div className="text-center">
      <a href="login.html" className="btn btn-primary">로그인 페이지로 이동</a>
    </div>
  </div>
);

export default SignUpSuccess;
