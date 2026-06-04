import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import VetLogin from './pages/Login';
import ServiciosPage from './pages/ServicioPage';
import AdminDashboard from './pages/AdminDashboard';
import VetRegister from './pages/Register';
import VetForgotPassword from './pages/ForgotPassword';
import VetResetPassword from './pages/ResetPassword';
import ClienteDashboard from './pages/ClienteDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/servicios" element={<ServiciosPage/>} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<VetLogin />} />
        <Route path="/registro" element={<VetRegister />} />
        <Route path="/olvide-contrasena" element={<VetForgotPassword />} />
        <Route path="/restablecer-contrasena" element={<VetResetPassword />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/cliente" element={<ClienteDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;