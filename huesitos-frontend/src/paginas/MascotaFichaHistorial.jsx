import LineaTiempoHistorialMascota from '../componentes/LineaTiempoHistorialMascota';

const MascotaFichaHistorial = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <LineaTiempoHistorialMascota mostrarCabecera={true} />
      </div>
    </div>
  );
};

export default MascotaFichaHistorial;