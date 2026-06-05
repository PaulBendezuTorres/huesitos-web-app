import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ClienteInicio from '../modulos/cliente/paginas/ClienteInicio';
import ClienteMascotas from '../modulos/cliente/paginas/ClienteMascotas';
import ClienteAgendarCita from '../modulos/cliente/paginas/ClienteAgendarCita';
import ClienteTienda from '../modulos/cliente/paginas/ClienteTienda';
import PlantillaTablero from '../componentes/PlantillaTablero';

const TableroCliente = () => {
  const navigate = useNavigate();
  const [correo] = useState(localStorage.getItem('usuarioCorreo') || 'Cliente');
  const [vistaActual, setVistaActual] = useState('dashboard');

  useEffect(() => {
    const rol = localStorage.getItem('usuarioRol');
    if (rol !== 'CLIENTE') {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'dashboard': return <ClienteInicio />;
      case 'mascotas': return <ClienteMascotas />;
      case 'citas': return <ClienteAgendarCita />;
      case 'tienda': return <ClienteTienda />;
      case 'recetas': return <PlaceholderVista titulo="Mis recetas" descripcion="Próximamente: descarga de recetas PDF." />;
      case 'facturacion': return <PlaceholderVista titulo="Facturación" descripcion="Próximamente: historial de pagos." />;
      default: return <ClienteInicio />;
    }
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
      {renderizarVista()}
    </PlantillaTablero>
  );
};

const PlaceholderVista = ({ titulo, descripcion }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-300 mb-2">{titulo}</h2>
      <p className="text-sm text-slate-400">{descripcion}</p>
    </div>
  </div>
);

export default TableroCliente;
