import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BotonVolver = ({ etiqueta = 'Volver' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 border border-slate-200 hover:border-sky-300 rounded-lg px-2.5 py-1.5 transition-all shrink-0 ml-3"
    >
      <ArrowLeft size={13} />
      {etiqueta}
    </button>
  );
};

export default BotonVolver;
