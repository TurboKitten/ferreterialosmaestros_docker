package com.stackertriple.ferreterialosmaestros.repository;

import com.stackertriple.ferreterialosmaestros.model.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByFolio(String folio);
}
