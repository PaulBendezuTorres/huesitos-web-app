package huesitos_backend.repositorios;

import huesitos_backend.entidades.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventarioRepositorio extends JpaRepository<Inventario, Long> {
    List<Inventario> findByProductoIdAndActivoTrue(Long productoId);
    List<Inventario> findByActivoTrue();

    @Query("SELECT COALESCE(SUM(i.stock), 0) FROM Inventario i WHERE i.producto.id = :productoId AND i.activo = true AND (i.fechaVencimiento IS NULL OR i.fechaVencimiento >= CURRENT_DATE)")
    Integer obtenerStockDisponible(@Param("productoId") Long productoId);
}
