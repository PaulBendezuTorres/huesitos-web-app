package huesitos_backend.dominios.tienda.repositorios;

import huesitos_backend.dominios.tienda.entidades.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepositorio extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteId(Long clienteId);

    List<Pedido> findByClienteIdOrderByFechaPedidoDesc(Long clienteId);
}
