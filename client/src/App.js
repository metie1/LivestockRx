import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnimalList from './components/AnimalList';
import AnimalDetails from './components/AnimalDetails';
import Calendar from './components/Calendar';
import Conversation from './components/Conversation';
import MedicationInfo from './components/MedicationInfo';
import Login from './components/Login';
import LoginError from './components/LoginError';
import Signup from './components/SignUp';
import Main from './components/Main';
import SignupSuccess from './components/SignUpSuccess';
import Subscribe from './components/Subscribe';
import Vaccin from './components/Vaccin';
import NavigationBar from './components/NavigationBar';
import './styles/global.scss';
import MyPage from './components/MyPage';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/animals" element={<AnimalList />} />
          <Route path="/animals/:id" element={<AnimalDetails />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/MedicationInfo" element={<MedicationInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login_error" element={<LoginError />} />
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup_success" element={<SignupSuccess />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/vaccin" element={<Vaccin />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
