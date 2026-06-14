package huesitos_backend.dominios.tienda.repositorios;

import huesitos_backend.dominios.tienda.entidades.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CarritoItemRepositorio extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByClienteId(Long clienteId);

    Optional<CarritoItem> findByClienteIdAndProductoId(Long clienteId, Long productoId);

    void deleteByClienteId(Long clienteId);
}
