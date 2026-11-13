package com.stackertriple.ferreterialosmaestros.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "ProductoResponse", description = "Producto del catálogo devuelto por la API")
public record ProductoResponse(
        @Schema(description = "Identificador interno del producto", example = "1")
        Long id,

        @Schema(description = "Código único del producto", example = "FER-001")
        String codigo,

        @Schema(description = "Nombre del producto", example = "Martillo carpintero 16 oz")
        String nombre,

        @Schema(description = "Categoría del producto", example = "Herramientas")
        String categoria,

        @Schema(description = "Precio unitario en CLP", example = "8990.00")
        BigDecimal precio,

        @Schema(description = "Stock disponible", example = "25")
        Integer stock,

        @Schema(description = "Descripción del producto", example = "Mango de madera, cabeza de acero forjado")
        String descripcion,

        @Schema(description = "Indica si está activo en la tienda", example = "true")
        Boolean activo
) {
}
