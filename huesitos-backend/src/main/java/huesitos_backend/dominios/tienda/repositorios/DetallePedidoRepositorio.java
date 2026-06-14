package huesitos_backend.dominios.tienda.repositorios;

import huesitos_backend.dominios.tienda.entidades.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetallePedidoRepositorio extends JpaRepository<DetallePedido, Long> {
    List<DetallePedido> findByPedidoId(Long pedidoId);
}
