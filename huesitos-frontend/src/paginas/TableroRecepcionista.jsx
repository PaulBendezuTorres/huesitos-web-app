import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import GestionPedidos from './GestionPedidos';
import AgendaSemanal from './AgendaSemanal';
import CajaVentas from '../modulos/recepcionista/paginas/CajaVentas';
import PlantillaTablero from '../componentes/PlantillaTablero';

const TableroRecepcionista = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Recepcionista');
  const [seccionActiva, setSeccionActiva] = useState(() => {
    const subvista = localStorage.getItem('subvistaDefecto');
    if (subvista) {
      localStorage.removeItem('subvistaDefecto');
      return subvista;
    }
    return localStorage.getItem('recepcionistaVistaActual') || 'caja';
  });

  useEffect(() => {
    localStorage.setItem('recepcionistaVistaActual', seccionActiva);
  }, [seccionActiva]);

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'RECEPCIONISTA' && rol !== 'ADMINISTRADOR') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const obtenerTituloHeader = () => {
    switch (seccionActiva) {
      case 'caja': return 'Caja y punto de venta';
      case 'pedidos': return 'Despacho de pedidos';
      case 'agenda': return 'Agenda semanal';
      default: return 'Caja y POS';
    }
  };

  const renderizarVista = () => {
    switch (seccionActiva) {
      case 'caja':
        return <CajaVentas />;
      case 'pedidos':
        return <GestionPedidos />;
      case 'agenda':
        return (
          <section className="flex-1 bg-slate-50 p-4 lg:p-6 overflow-y-auto h-full w-full animate-in fade-in duration-200">
            <AgendaSemanal />
          </section>
        );
      default:
        return <CajaVentas />;
    }
  };

  return (
    <PlantillaTablero
      rol="RECEPCIONISTA"
      correo={correo}
      vistaActual={seccionActiva}
      setVistaActual={setSeccionActiva}
      handleLogout={handleLogout}
      tituloHeader={obtenerTituloHeader()}
      sinPadding={true}
    >
      {renderizarVista()}
    </PlantillaTablero>
  );
};

export default TableroRecepcionista;
