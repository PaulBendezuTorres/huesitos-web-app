import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portada from './paginas/Portada';
import IniciarSesion from './paginas/IniciarSesion';
import PaginaServicios from './paginas/PaginaServicios';
import TableroAdministrador from './paginas/TableroAdministrador';
import Registro from './paginas/Registro';
import RecuperarContrasena from './paginas/RecuperarContrasena';
import RestablecerContrasena from './paginas/RestablecerContrasena';
import VerificarCuenta from './paginas/VerificarCuenta';
import TableroCliente from './paginas/TableroCliente';
import MascotaFichaHistorial from './paginas/MascotaFichaHistorial';
import TableroVeterinario from './paginas/TableroVeterinario';
import TableroRecepcionista from './paginas/TableroRecepcionista';
import MiPerfil from './paginas/MiPerfil';

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
        <Route path="/cliente" element={<TableroCliente />} />
        <Route path="/cliente/mascota/:mascotaId" element={<MascotaFichaHistorial />} />
        <Route path="/veterinario" element={<TableroVeterinario />} />
        <Route path="/recepcion" element={<TableroRecepcionista />} />
        <Route path="/perfil" element={<MiPerfil />} />
      </Routes>
    </Router>
  );
}
export default App;