import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portada from '@/paginas/dashboard/Portada';
import IniciarSesion from '@/paginas/autenticacion/IniciarSesion';
import PaginaServicios from '@/paginas/servicio/PaginaServicios';
import TableroAdministrador from '@/paginas/dashboard/TableroAdministrador';
import Registro from '@/paginas/autenticacion/Registro';
import RecuperarContrasena from '@/paginas/autenticacion/RecuperarContrasena';
import RestablecerContrasena from '@/paginas/autenticacion/RestablecerContrasena';
import VerificarCuenta from '@/paginas/autenticacion/VerificarCuenta';
import TableroCliente from '@/paginas/dashboard/TableroCliente';
import MascotaFichaHistorial from '@/paginas/clinico/MascotaFichaHistorial';
import TableroVeterinario from '@/paginas/dashboard/TableroVeterinario';
import TableroRecepcionista from '@/paginas/dashboard/TableroRecepcionista';
import MiPerfil from '@/paginas/dashboard/MiPerfil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/servicios" element={<PaginaServicios/>} />
        <Route path="/" element={<Portada />} />
        <Route path="/login" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/verificar-cuenta" element={<VerificarCuenta />} />
        <Route path="/olvide-contrasena" element={<RecuperarContrasena />} />
        <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
        <Route path="/admin/*" element={<TableroAdministrador />} />
        <Route path="/cliente/*" element={<TableroCliente />} />
        <Route path="/cliente/mascota/:mascotaId" element={<MascotaFichaHistorial />} />
        <Route path="/veterinario" element={<TableroVeterinario />} />
        <Route path="/recepcion" element={<TableroRecepcionista />} />
        <Route path="/perfil" element={<MiPerfil />} />
      </Routes>
    </Router>
  );
}
export default App;