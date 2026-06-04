import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import VetLogin from './pages/Login';
import ServiciosPage from './pages/ServicioPage';
import AdminDashboard from './pages/AdminDashboard';
import VetRegister from './pages/Register';
import VetForgotPassword from './pages/ForgotPassword';
import VetResetPassword from './pages/ResetPassword';
import ClienteDashboard from './pages/ClienteDashboard';
import MascotaFichaHistorial from './pages/MascotaFichaHistorial';
import VeterinarioDashboard from './pages/VeterinarioDashboard';
import RecepcionistaDashboard from './pages/RecepcionistaDashboard';

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
        <Route path="/cliente/mascota/:mascotaId" element={<MascotaFichaHistorial />} />
        <Route path="/veterinario" element={<VeterinarioDashboard />} />
        <Route path="/recepcion" element={<RecepcionistaDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;