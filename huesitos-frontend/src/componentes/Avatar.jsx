import { UserCircle } from 'lucide-react';

const Avatar = ({ url, nombre = "", size = "w-8 h-8", className = "" }) => {
  const esUrlValida = url && url !== "/uploads/defecto-usuario.png";
  const inicial = nombre ? nombre.trim().charAt(0).toUpperCase() : "";

  return (
    <div className={`rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner border border-slate-200/50 shrink-0 ${size} ${className}`}>
      {esUrlValida ? (
        <img 
          src={`http://localhost:8080${url}`} 
          alt="Foto de perfil" 
          className="w-full h-full object-cover" 
        />
      ) : inicial ? (
        <span className="font-bold text-slate-500 uppercase select-none text-[40%]">
          {inicial}
        </span>
      ) : (
        <UserCircle className="w-1/2 h-1/2" />
      )}
    </div>
  );
};

export default Avatar;
