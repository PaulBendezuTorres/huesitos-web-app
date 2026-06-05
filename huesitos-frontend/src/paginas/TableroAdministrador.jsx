import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PaginaServicios from './PaginaServicios';
import DashboardAnalytics from '../modulos/admin/paginas/TableroAnaliticas';
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
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Admin');
  const [vistaActual, setVistaActual] = useState('dashboard');

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'ADMINISTRADOR') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'dashboard': return <DashboardAnalytics />;
      case 'servicios': return <PaginaServicios />;
      case 'usuarios': return <PaginaUsuarios />;
      case 'duenos': return <PaginaDuenos />;
      case 'agenda': return <AgendaSemanal />;
      case 'horarios': return <ConfiguracionHorarios />;
      case 'inventario': return <PaginaInventario />;
      case 'finanzas': return <PaginaFinanzas />;
      case 'campanas': return <PaginaCampanas />;
      case 'configuracion': return <ConfiguracionDinamica />;
      case 'pedidos': return <GestionPedidos />;
      default: return <DashboardAnalytics />;
    }
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
      {renderizarVista()}
    </PlantillaTablero>
  );
};

export default TableroAdministrador;