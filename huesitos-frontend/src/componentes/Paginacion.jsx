import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Paginacion = ({
  paginaActual,
  totalItems,
  itemsPorPagina,
  onPaginaChange,
  onItemsPorPaginaChange,
  opcionesFilas = [5, 10, 15, 20],
  singularLabel = "servicio",
  pluralLabel = "servicios"
}) => {
  const totalPaginas = Math.max(1, Math.ceil(totalItems / itemsPorPagina));
  
  // Rango de elementos mostrados
  const desde = (paginaActual - 1) * itemsPorPagina + 1;
  const hasta = Math.min(paginaActual * itemsPorPagina, totalItems);

  // Generar array de páginas visibles de forma inteligente
  const obtenerPaginasVisibles = () => {
    const paginas = [];
    const maxPaginasVisibles = 5;
    
    if (totalPaginas <= maxPaginasVisibles) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      let inicio = Math.max(1, paginaActual - 2);
      let fin = Math.min(totalPaginas, paginaActual + 2);
      
      if (inicio === 1) {
        fin = maxPaginasVisibles;
      } else if (fin === totalPaginas) {
        inicio = totalPaginas - maxPaginasVisibles + 1;
      }
      
      for (let i = inicio; i <= fin; i++) paginas.push(i);
    }
    return paginas;
  };

  const paginasVisibles = obtenerPaginasVisibles();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 border-t border-slate-150/60 rounded-b-2xl select-none">
      
      {/* Información de Registros */}
      <div className="text-xs text-slate-500 font-semibold order-2 sm:order-1">
        {totalItems > 0 ? (
          <>
            Mostrando <span className="font-bold text-slate-800">{desde}</span> al{" "}
            <span className="font-bold text-slate-800">{hasta}</span> de{" "}
            <span className="font-bold text-slate-800">{totalItems}</span>{" "}
            {totalItems === 1 ? singularLabel : pluralLabel}
          </>
        ) : (
          `No hay ${pluralLabel} disponibles`
        )}
      </div>

      {/* Controles de Navegación */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Ir al inicio */}
        <button
          onClick={() => onPaginaChange(1)}
          disabled={paginaActual === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-transparent transition-all active:scale-95 shadow-sm"
          title="Primera página"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Anterior */}
        <button
          onClick={() => onPaginaChange(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-transparent transition-all active:scale-95 shadow-sm"
          title="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Números de Página */}
        {paginasVisibles.map((pag) => (
          <button
            key={pag}
            onClick={() => onPaginaChange(pag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
              paginaActual === pag
                ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white border border-sky-400 shadow-sky-500/10"
                : "border border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {pag}
          </button>
        ))}

        {/* Siguiente */}
        <button
          onClick={() => onPaginaChange(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-transparent transition-all active:scale-95 shadow-sm"
          title="Siguiente página"
        >
          <ChevronRight size={16} />
        </button>

        {/* Ir al final */}
        <button
          onClick={() => onPaginaChange(totalPaginas)}
          disabled={paginaActual === totalPaginas}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-transparent transition-all active:scale-95 shadow-sm"
          title="Última página"
        >
          <ChevronsRight size={16} />
        </button>

        {/* Selector de Filas por Página */}
        {onItemsPorPaginaChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <select
              value={itemsPorPagina}
              onChange={(e) => onItemsPorPaginaChange(Number(e.target.value))}
              className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-350 p-1.5 rounded-lg outline-none cursor-pointer transition-all shadow-sm"
            >
              {opcionesFilas.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / pág
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

    </div>
  );
};

export default Paginacion;
