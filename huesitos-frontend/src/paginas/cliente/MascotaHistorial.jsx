import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, PawPrint } from 'lucide-react';
import LineaTiempoHistorialMascota from '@/componentes/clinico/LineaTiempoHistorialMascota';

const MascotaHistorial = () => {
  const { mascotaId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Breadcrumb / volver */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/cliente/mascotas')}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft size={15} />
          Mis mascotas
        </button>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <PawPrint size={14} className="text-sky-500" />
          Historial clínico
        </div>
      </div>

      {/* Componente de historial reutilizable */}
      <LineaTiempoHistorialMascota
        mascotaId={mascotaId}
        mostrarCabecera={true}
        onBack={() => navigate('/cliente/mascotas')}
      />
    </div>
  );
};

export default MascotaHistorial;
