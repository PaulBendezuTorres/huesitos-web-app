import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FormularioRegistroMascota from '@/componentes/cliente/FormularioRegistroMascota';

const RegistrarMascotaCliente = () => {
  const navigate = useNavigate();
  const duenoId = localStorage.getItem('duenoId');

  const handleExito = () => {
    navigate('/cliente/mascotas');
  };

  const handleCancelar = () => {
    navigate('/cliente/mascotas');
  };

  return (
    <div className="w-full space-y-6">
      {/* Botón Volver */}
      <button
        onClick={handleCancelar}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-colors duration-250 self-start"
      >
        <ArrowLeft size={16} /> Volver a mis mascotas
      </button>

      {/* Componente Desacoplado del Formulario - Alineado a la izquierda */}
      <FormularioRegistroMascota
        duenoId={duenoId}
        onExito={handleExito}
        onCancelar={handleCancelar}
      />
    </div>
  );
};

export default RegistrarMascotaCliente;
