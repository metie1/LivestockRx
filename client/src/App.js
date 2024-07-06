import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnimalDetail from './components/AnimalDetail';
import Calendar from './components/Calendar';
import Conversation from './components/Conversation';
import Login from './components/Login';
import LoginError from './components/LoginError';
import Signup from './components/SignUp';
import Main from './components/Main';
import SignupSuccess from './components/SignUpSuccess';
import Subscribe from './components/Subscribe';
import Vaccin from './components/Vaccin';
import NavigationBar from './components/NavigationBar';
import './styles/global.scss';

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/animal_detail" element={<AnimalDetail />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login_error" element={<LoginError />} />
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup_success" element={<SignupSuccess />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/vaccin" element={<Vaccin />} />
      </Routes>
    </Router>
  );
};

export default App;
