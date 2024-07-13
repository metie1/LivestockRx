import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/MyPage.scss';

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
      setEditedUser(response.data); // 초기 편집 상태를 현재 사용자 데이터로 설정
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user); // 편집을 취소하면 원래 사용자 데이터로 복원
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/me', editedUser, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(editedUser);
      setIsEditing(false);
      alert('프로필이 업데이트되었습니다.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await axios.delete('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        logout();
        alert('계정이 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('계정 삭제에 실패했습니다.');
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>사용자명:</label>
          <input
            type="text"
            name="username"
            value={isEditing ? editedUser.username : user.username}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={isEditing ? editedUser.email : user.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label>역할:</label>
          <input
            type="text"
            value={user.role}
            disabled
          />
        </div>
        {isEditing ? (
          <>
            <button type="submit">저장</button>
            <button type="button" onClick={handleCancel}>취소</button>
          </>
        ) : (
          <button type="button" onClick={handleEdit}>수정</button>
        )}
      </form>
      <button onClick={handleDeleteAccount} className="delete-account">계정 삭제</button>
    </div>
  );
};

export default MyPage;