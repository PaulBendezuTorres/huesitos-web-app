import { useState } from 'react';
import { PawPrint } from 'lucide-react';
import useTableroCliente from '@/hooks/useTableroCliente';
import ListaMascotas from '@/componentes/cliente/ListaMascotas';
import ModalEditarMascota from '@/componentes/cliente/ModalEditarMascota';
import ModalEliminarMascota from '@/componentes/cliente/ModalEliminarMascota';

const ClienteMascotas = () => {
  const { mascotas, cargando, recargar, setMascotas } = useTableroCliente();
  const [mascotaEditando, setMascotaEditando] = useState(null);
  const [mascotaEliminando, setMascotaEliminando] = useState(null);

  const handleEdicionExito = (mascotaActualizada) => {
    setMascotas((prev) =>
      prev.map((m) => (m.id === mascotaActualizada.id ? mascotaActualizada : m))
    );
    setMascotaEditando(null);
  };

  const handleEliminacionExito = (mascotaId) => {
    setMascotas((prev) => prev.filter((m) => m.id !== mascotaId));
    setMascotaEliminando(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Encabezado de sección */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300">
            Mis mascotas
          </h2>
          <p className="text-sm text-slate-450 dark:text-slate-500 mt-0.5 transition-colors duration-300">
            Gestiona la salud y el historial de tus compañeros
          </p>
        </div>

        {/* Cargando */}
        {cargando ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                Cargando mascotas...
              </span>
            </div>
          </div>
        ) : (
          <ListaMascotas
            mascotas={mascotas}
            onRecargar={recargar}
            onEditar={setMascotaEditando}
            onEliminar={setMascotaEliminando}
          />
        )}
      </div>

      {/* Modales */}
      {mascotaEditando && (
        <ModalEditarMascota
          mascota={mascotaEditando}
          onCerrar={() => setMascotaEditando(null)}
          onExito={handleEdicionExito}
        />
      )}
      {mascotaEliminando && (
        <ModalEliminarMascota
          mascota={mascotaEliminando}
          onCerrar={() => setMascotaEliminando(null)}
          onExito={handleEliminacionExito}
        />
      )}
    </>
  );
};

export default ClienteMascotas;
