package com.stackertriple.ferreterialosmaestros.dto.response;

import java.math.BigDecimal;

public record ProductoResponse(
        Long id,
        String codigo,
        String nombre,
        String categoria,
        BigDecimal precio,
        Integer stock,
        String descripcion,
        Boolean activo
) {
}
