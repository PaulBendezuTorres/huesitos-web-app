import { useState, useEffect } from 'react';
import { obtenerTodosLosPedidos, cambiarEstadoPedido } from '@/api/tiendaApi';
import ListaPedidosDespacho from '@/componentes/tienda/ListaPedidosDespacho';
import DetallePedidoDespacho from '@/componentes/tienda/DetallePedidoDespacho';

const GestionPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('TODOS'); // TODOS, PENDIENTE, PAGADO, ENTREGADO, CANCELADO
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [procesandoDespacho, setProcesandoDespacho] = useState(false);

  const fetchPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const data = await obtenerTodosLosPedidos();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener los pedidos de la tienda online:", error);
    } finally {
      setLoadingPedidos(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    setProcesandoDespacho(true);
    try {
      await cambiarEstadoPedido(pedidoId, nuevoEstado);
      alert(`Pedido ${pedidoId} actualizado a ${nuevoEstado} con éxito.`);
      setPedidoSeleccionado(null);
      fetchPedidos();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el estado del pedido: " + (error.response?.data || error.message));
    } finally {
      setProcesandoDespacho(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroEstadoPedido === 'TODOS') return true;
    return p.estado === filtroEstadoPedido;
  });

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-full bg-slate-50 dark:bg-slate-900 w-full p-4 lg:p-6 gap-6">
      {/* PANEL IZQUIERDO: Listado de pedidos */}
      <section className={`w-full lg:w-[38%] lg:max-w-md flex flex-col overflow-hidden shrink-0 ${
        pedidoSeleccionado ? 'hidden lg:flex' : 'flex'
      }`}>
        <ListaPedidosDespacho
          pedidosFiltrados={pedidosFiltrados}
          pedidoSeleccionado={pedidoSeleccionado}
          onSeleccionarPedido={setPedidoSeleccionado}
          filtroEstadoPedido={filtroEstadoPedido}
          setFiltroEstadoPedido={setFiltroEstadoPedido}
          loadingPedidos={loadingPedidos}
        />
      </section>

      {/* PANEL DERECHO: Detalle del pedido seleccionado */}
      <section className={`flex-1 flex flex-col overflow-hidden ${
        pedidoSeleccionado ? 'flex' : 'hidden lg:flex'
      }`}>
        <DetallePedidoDespacho
          pedido={pedidoSeleccionado}
          onVolver={() => setPedidoSeleccionado(null)}
          onActualizarEstado={actualizarEstadoPedido}
          procesando={procesandoDespacho}
        />
      </section>
    </div>
  );
};

export default GestionPedidos;
