import { ChevronDown, ChevronUp, Package, Trash2, FolderOpen, Edit2 } from 'lucide-react';

const TablaInventario = ({
  productosPaginados = [],
  lotes = [],
  alertasBajoStock = [],
  alertasVencimiento = [],
  productoExpandido,
  setProductoExpandido,
  calcularStockProducto,
  handleDesactivarProducto,
  handleDesactivarLote,
  setModalAjuste,
  formatarFecha,
  obtenerBadgeVencimiento
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-3.5 w-12"></th>
            <th className="p-3.5">ID</th>
            <th className="p-3.5">Producto</th>
            <th className="p-3.5">Categoría</th>
            <th className="p-3.5 text-right">Precio</th>
            <th className="p-3.5 text-center">Mínimo</th>
            <th className="p-3.5 text-center">Disponible</th>
            <th className="p-3.5 text-center">Estado</th>
            <th className="p-3.5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {productosPaginados.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-10 text-slate-450 font-bold">
                No se encontraron productos registrados.
              </td>
            </tr>
          ) : (
            productosPaginados.map((p) => {
              const stockTotal = calcularStockProducto(p.id);
              const esBajoStock = stockTotal <= (p.stockMinimo || 5);
              const expandido = productoExpandido === p.id;
              const lotesDelProducto = lotes.filter((l) => l.producto?.id === p.id && l.activo);

              return (
                <tr key={`group-${p.id}`} className="contents">
                  <tr 
                    className={`hover:bg-slate-50/20 dark:hover:bg-slate-700/20 transition-colors ${
                      expandido ? 'bg-sky-50/5 dark:bg-sky-900/10' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setProductoExpandido(expandido ? null : p.id)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                      >
                        {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                    <td className="p-3.5 font-bold text-slate-400 dark:text-slate-500">#{p.id}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center text-slate-300 shadow-inner shrink-0">
                          {p.fotoUrl ? (
                            <img 
                              src={`http://localhost:8080${p.fotoUrl}`} 
                              alt={p.nombre} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Package size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm truncate max-w-xs">{p.nombre}</div>
                          {p.descripcion && <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-xs mt-0.5">{p.descripcion}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-650 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-200/50 dark:border-slate-600 font-semibold">
                        {p.categoria?.nombre || 'General'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-700 dark:text-slate-300">S/ {p.precio?.toFixed(2)}</td>
                    <td className="p-3.5 text-center font-semibold text-slate-500 dark:text-slate-400">{p.stockMinimo} unds.</td>
                    <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-100">{stockTotal} unds.</td>
                    <td className="p-3.5 text-center">
                      {esBajoStock ? (
                        <span className="bg-red-50 text-red-650 border-red-200/50 text-[9px] font-bold px-2 py-0.5 rounded border">
                          Stock Crítico
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-650 border-emerald-200/50 text-[9px] font-bold px-2 py-0.5 rounded border">
                          Abastecido
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleDesactivarProducto(p.id)}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-100/50 transition-all shadow-sm active:scale-95"
                        title="Desactivar producto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>

                  {/* Fila expandida de lotes */}
                  {expandido && (
                    <tr className="bg-slate-50/30 dark:bg-slate-900/30">
                      <td colSpan="9" className="p-3.5">
                        <div className="pl-6 md:pl-12 pr-2 py-1.5 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-slate-750 dark:text-slate-300 text-xs flex items-center gap-1.5">
                              <FolderOpen size={13} className="text-sky-500" />
                              Lotes Activos (Lotes con fecha crítica de caducidad)
                            </h4>
                          </div>

                          {lotesDelProducto.length === 0 ? (
                            <div className="p-4 text-center text-slate-400 dark:text-slate-500 font-semibold border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs">
                              No hay lotes de stock registrados para este producto. Registra uno nuevo.
                            </div>
                          ) : (
                            <div className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                                    <th className="p-2.5">Código de Lote</th>
                                    <th className="p-2.5">Stock</th>
                                    <th className="p-2.5">Ingreso</th>
                                    <th className="p-2.5">Vencimiento</th>
                                    <th className="p-2.5 text-center">Estado</th>
                                    <th className="p-2.5 text-center">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                  {lotesDelProducto.map((lote) => {
                                    return (
                                      <tr key={`lote-${lote.id}`} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-2.5 font-mono font-bold text-slate-750 dark:text-slate-300">{lote.codigoLote}</td>
                                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-100">{lote.stock} unds.</td>
                                        <td className="p-2.5 text-slate-400 dark:text-slate-500">{formatarFecha(lote.fechaIngreso)}</td>
                                        <td className="p-2.5 text-slate-600 dark:text-slate-300 font-bold">{formatarFecha(lote.fechaVencimiento)}</td>
                                        <td className="p-2.5 text-center">
                                          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded border ${obtenerBadgeVencimiento(lote)}`}>
                                            {lote.fechaVencimiento ? (
                                              alertasVencimiento.some((v) => v.id === lote.id) ? 'PRÓXIMO A VENCER' : 'VIGENTE'
                                            ) : 'SIN VENCIMIENTO'}
                                          </span>
                                        </td>
                                        <td className="p-2.5 text-center">
                                          <div className="flex items-center justify-center gap-1">
                                            <button
                                              onClick={() => setModalAjuste(lote)}
                                              className="p-1 hover:bg-sky-50 border border-transparent hover:border-sky-200 text-sky-600 rounded transition-colors"
                                              title="Ajustar stock"
                                            >
                                              <Edit2 size={11} />
                                            </button>
                                            <button
                                              onClick={() => handleDesactivarLote(lote.id)}
                                              className="p-1 hover:bg-red-50 border border-transparent hover:border-red-200 text-red-500 rounded transition-colors"
                                              title="Desactivar lote"
                                            >
                                              <Trash2 size={11} />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tr >
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInventario;
