import React from "react";

const MascotaCard = ({ mascota, onVerHistorial }) => {
  const saludBadge = mascota.proximaVacuna 
    ? <Badge color="amarillo" text="Próxima Vacuna">{mascota.proximaVacuna}</Badge>
    : <Badge color="verde" text="Saludable">Saludable</Badge>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden group">
      <div onClick={onVerHistorial} className="flex items-center p-4 gap-4">
        <img 
          src={mascota.fotoPerfil || "/placeholder-mascota.jpg"} 
          alt={mascota.nombre}
          className="w-16 h-16 rounded-full object-cover border-2 border-sky-400 group-hover:scale-105 transition-transform"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-slate-900 truncate">{mascota.nombre}</h3>
          <p className="text-sm text-slate-600">{mascota.especie} - {mascota.raza}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge color="slate" text="Adulto">{mascota.edad || "N/A"} años</Badge>
            {saludBadge}
          </div>
        </div>
        <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-medium">
          Ver Historial
        </button>
      </div>
    </div>
  );
};

export default MascotaCard;