import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';

import PaginaServicios from '@/paginas/servicio/PaginaServicios';
import DashboardAnalytics from '@/paginas/dashboard/TableroAnaliticas';
import MiPerfil from '@/paginas/dashboard/MiPerfil';
import ConfiguracionDinamica from '@/paginas/dashboard/ConfiguracionDinamica';
import PaginaUsuarios from '@/paginas/dashboard/PaginaUsuarios';
import PaginaFinanzas from '@/paginas/finanzas/PaginaFinanzas';
import PaginaDuenos from '@/paginas/cliente/PaginaDuenos';
import RegistrarClienteNuevo from '@/paginas/cliente/RegistrarClienteNuevo';
import AgendaSemanal from '@/paginas/cita/AgendaSemanal';
import ConfiguracionHorarios from '@/paginas/cita/ConfiguracionHorarios';
import PaginaInventario from '@/paginas/tienda/PaginaInventario';
import RegistrarProductoNuevo from '@/paginas/tienda/RegistrarProductoNuevo';
import PaginaCampanas from '@/paginas/marketing/PaginaCampanas';
import RegistrarCampana from '@/paginas/marketing/RegistrarCampana';
import RegistrarOferta from '@/paginas/marketing/RegistrarOferta';
import GestionPedidos from '@/paginas/tienda/GestionPedidos';
import PlantillaTablero from '@/componentes/layout/PlantillaTablero';

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
      sinPadding={vistaActual === 'pedidos' || vistaActual === 'agenda'}
    >
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardAnalytics />} />
        <Route path="servicios/*" element={<PaginaServicios />} />
        <Route path="usuarios" element={<PaginaUsuarios />} />
        <Route path="clientes" element={<PaginaDuenos />} />
        <Route path="clientes/nuevo" element={<RegistrarClienteNuevo />} />
        <Route path="clientes/editar/:id" element={<RegistrarClienteNuevo />} />
        <Route path="agenda" element={<AgendaSemanal />} />
        <Route path="horarios" element={<ConfiguracionHorarios />} />
        <Route path="inventario" element={<PaginaInventario />} />
        <Route path="inventario/registrar-producto" element={<RegistrarProductoNuevo />} />
        <Route path="finanzas" element={<PaginaFinanzas />} />
        <Route path="campanas" element={<PaginaCampanas />} />
        <Route path="campanas/nueva" element={<RegistrarCampana />} />
        <Route path="campanas/editar/:id" element={<RegistrarCampana />} />
        <Route path="campanas/oferta/nueva" element={<RegistrarOferta />} />
        <Route path="campanas/oferta/editar/:id" element={<RegistrarOferta />} />
        <Route path="configuracion" element={<ConfiguracionDinamica />} />
        <Route path="pedidos" element={<GestionPedidos />} />
        <Route path="perfil" element={<MiPerfil sinPlantilla={true} />} />
        <Route path="*" element={<DashboardAnalytics />} />
      </Routes>
    </PlantillaTablero>
  );
};

export default TableroAdministrador;