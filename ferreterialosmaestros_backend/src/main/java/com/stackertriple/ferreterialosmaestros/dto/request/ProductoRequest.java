package com.stackertriple.ferreterialosmaestros.dto.request;

import java.math.BigDecimal;

public record ProductoRequest(
        String codigo,
        String nombre,
        String categoria,
        BigDecimal precio,
        Integer stock,
        String descripcion,
        Boolean activo
) {
}
