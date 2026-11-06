package com.stackertriple.ferreterialosmaestros.repository;

import com.stackertriple.ferreterialosmaestros.model.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findByCodigo(String codigo);
}
