import useTableroCliente from '@/hooks/useTableroCliente';
import CarruselCampanas from '@/componentes/cliente/CarruselCampanas';
import TarjetasMascotasCliente from '@/componentes/cliente/TarjetasMascotasCliente';
import TablaCitasProximas from '@/componentes/cliente/TablaCitasProximas';

const ClienteInicio = () => {
  const { mascotas, citas, campanas, cargando, recargar } = useTableroCliente();

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
            Cargando tu panel...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Ruleta/Carrusel de Campañas Publicitarias */}
      <CarruselCampanas campanas={campanas} />

      {/* Grid de Mascotas con su respectiva cabecera y botón de recarga */}
      <TarjetasMascotasCliente mascotas={mascotas} recargar={recargar} />

      {/* Listado de Próximas Citas */}
      <TablaCitasProximas citas={citas} />
    </div>
  );
};

export default ClienteInicio;
