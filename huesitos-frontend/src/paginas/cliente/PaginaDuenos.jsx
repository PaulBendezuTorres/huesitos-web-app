import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  obtenerListaDuenos
} from '@/servicios/duenoServicio';
import { UserPlus, MapPin, Phone, Mail, Edit2 } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import Buscador from '@/componentes/comun/Buscador';
import Avatar from '@/componentes/comun/Avatar';

const PaginaDuenos = () => {
  const navigate = useNavigate();
  const [duenos, setDuenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [busqueda, setBusqueda] = useState("");


  useEffect(() => {
    const fetchDuenos = async () => {
      setLoading(true);
      try {
        const data = await obtenerListaDuenos();
        setDuenos(data);
      } catch (error) {
        console.error("Error al recuperar los clientes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDuenos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // No se requieren funciones para modales internos ya que ahora se navega a páginas independientes.

  const duenosFiltrados = duenos.filter(d => 
    d.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.telefono?.includes(busqueda)
  );

  if (loading && duenos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <CargadorSpinner size="lg" />
        <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold animate-pulse">Sincronizando expedientes de clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Directorio de Clientes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administración de fichas y cuentas de acceso de la clientela.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/clientes/nuevo')}
          className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2"
        >
          <UserPlus size={18} /> Registrar Cliente
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="max-w-md">
        <Buscador 
          value={busqueda} 
          onChange={setBusqueda} 
          placeholder="Buscar por nombre, correo o teléfono..." 
        />
      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
            <thead className="bg-slate-50/50 dark:bg-slate-900/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cliente y Correo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dirección Física</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
              {duenosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 font-semibold">
                    No se encontraron clientes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                duenosFiltrados.map((dueno) => (
                  <tr key={dueno.id} className="hover:bg-sky-50/30 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                         <Avatar url={dueno.fotoPerfilUrl} />
                         {dueno.nombreCompleto}
                      </div>
                      <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1 flex items-center gap-1"><Mail size={12}/> {dueno.correo || "Sin correo"}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14}/> {dueno.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate"><div className="flex items-center gap-1.5"><MapPin size={14}/> {dueno.direccion}</div></td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => navigate(`/admin/clientes/editar/${dueno.id}`)}
                        className="bg-white dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-sky-600 dark:text-sky-400 p-2 rounded-lg transition-all border border-slate-200 dark:border-slate-600 hover:border-sky-200 shadow-sm"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaginaDuenos;