// src/routes/routes.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Pages/Login/Login.jsx';
import Register from '../Pages/Register/Register.jsx';
import RegisterCar from '../Pages/RegisterCar/RegisterCar.jsx'
import Profile from '../Pages/Profile/Profile.jsx'
import HomePage from '../Pages/HomePage/HomePage.jsx';
import Detalhes from '../Pages/Detalhes/Detalhes.jsx'
import ResetPassword from '../Pages/ResetPassword/ResetPassword.jsx'
import Reservas from '../Pages/Reservas/Reservas.jsx';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/RegisterCar" element={<RegisterCar />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/detalhes/:id" element={<Detalhes />} />
        <Route path="/Reservas" element={<Reservas />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
