import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';

import PaginaServicios from './PaginaServicios';
import DashboardAnalytics from '../modulos/admin/paginas/TableroAnaliticas';
import MiPerfil from './MiPerfil';
import ConfiguracionDinamica from '../modulos/admin/paginas/ConfiguracionDinamica';
import PaginaUsuarios from '../modulos/admin/paginas/PaginaUsuarios';
import PaginaFinanzas from '../modulos/admin/paginas/PaginaFinanzas';
import PaginaDuenos from '../modulos/admin/paginas/PaginaDuenos';
import AgendaSemanal from './AgendaSemanal';
import ConfiguracionHorarios from '../modulos/admin/paginas/ConfiguracionHorarios';
import PaginaInventario from '../modulos/admin/paginas/PaginaInventario';
import PaginaCampanas from '../modulos/admin/paginas/PaginaCampanas';
import GestionPedidos from './GestionPedidos';
import PlantillaTablero from '../componentes/PlantillaTablero';

const TableroAdministrador = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Admin');

  // Obtener la subvista actual de la URL (si es vacía, asume 'dashboard' para la barra lateral)
  const subvistaUrl = location.pathname.split('/')[2];
  const vistaActual = subvistaUrl || 'dashboard';

  const setVistaActual = (nuevaVista) => {
    navigate(`/admin/${nuevaVista}`);
  };

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'ADMINISTRADOR') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const subvistaDefecto = localStorage.getItem('subvistaDefecto');
    if (subvistaDefecto) {
      localStorage.removeItem('subvistaDefecto');
      setVistaActual(subvistaDefecto);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <PlantillaTablero
      rol="ADMINISTRADOR"
      correo={correo}
      vistaActual={vistaActual}
      setVistaActual={setVistaActual}
      handleLogout={handleLogout}
      tituloHeader="Centro de Administración"
    >
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardAnalytics />} />
        <Route path="servicios" element={<PaginaServicios />} />
        <Route path="usuarios" element={<PaginaUsuarios />} />
        <Route path="duenos" element={<PaginaDuenos />} />
        <Route path="agenda" element={<AgendaSemanal />} />
        <Route path="horarios" element={<ConfiguracionHorarios />} />
        <Route path="inventario" element={<PaginaInventario />} />
        <Route path="finanzas" element={<PaginaFinanzas />} />
        <Route path="campanas" element={<PaginaCampanas />} />
        <Route path="configuracion" element={<ConfiguracionDinamica />} />
        <Route path="pedidos" element={<GestionPedidos />} />
        <Route path="perfil" element={<MiPerfil sinPlantilla={true} />} />
        <Route path="*" element={<DashboardAnalytics />} />
      </Routes>
    </PlantillaTablero>
  );
};

export default TableroAdministrador;