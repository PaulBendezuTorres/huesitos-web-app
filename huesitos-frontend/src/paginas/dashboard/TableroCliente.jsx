import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';

import ClienteInicio from '@/paginas/cliente/ClienteInicio';
import ClienteMascotas from '@/paginas/cliente/ClienteMascotas';
import RegistrarMascotaCliente from '@/paginas/cliente/RegistrarMascotaCliente';
import MascotaHistorial from '@/paginas/cliente/MascotaHistorial';
import MascotaVacunas from '@/paginas/cliente/MascotaVacunas';
import ClienteAgendarCita from '@/paginas/cita/ClienteAgendarCita';
import PaginaRetornoPago from '@/paginas/cliente/PaginaRetornoPago';
import ClienteTienda from '@/paginas/tienda/ClienteTienda';
import PlantillaTablero from '@/componentes/layout/PlantillaTablero';

const TableroCliente = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Cliente');

  // Obtener la subvista actual desde la URL (ej: /cliente/dashboard -> dashboard)
  const subvistaUrl = location.pathname.split('/')[2];
  const vistaActual = subvistaUrl || 'dashboard';

  const setVistaActual = (nuevaVista) => {
    navigate(`/cliente/${nuevaVista}`);
  };

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'CLIENTE') {
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
      rol="CLIENTE"
      correo={correo}
      vistaActual={vistaActual}
      setVistaActual={setVistaActual}
      handleLogout={handleLogout}
      tituloHeader="Portal del cliente"
    >
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClienteInicio />} />
        <Route path="mascotas" element={<ClienteMascotas />} />
        <Route path="mascotas/nueva" element={<RegistrarMascotaCliente />} />
        <Route path="mascotas/:mascotaId/historial" element={<MascotaHistorial />} />
        <Route path="mascotas/:mascotaId/vacunas" element={<MascotaVacunas />} />
        <Route path="citas" element={<ClienteAgendarCita />} />
        <Route path="citas/retorno-pago" element={<PaginaRetornoPago />} />
        <Route path="tienda" element={<ClienteTienda />} />
        <Route path="recetas" element={<PlaceholderVista titulo="Mis recetas" descripcion="Próximamente: descarga de recetas PDF." />} />
        <Route path="facturacion" element={<PlaceholderVista titulo="Facturación" descripcion="Próximamente: historial de pagos." />} />
        <Route path="*" element={<ClienteInicio />} />
      </Routes>
    </PlantillaTablero>
  );
};

const PlaceholderVista = ({ titulo, descripcion }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-350 dark:text-slate-500 mb-2 transition-colors duration-300">
        {titulo}
      </h2>
      <p className="text-sm text-slate-400 dark:text-slate-650 transition-colors duration-300">
        {descripcion}
      </p>
    </div>
  </div>
);

export default TableroCliente;
