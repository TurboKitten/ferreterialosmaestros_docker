package com.stackertriple.ferreterialosmaestros.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "ProductoRequest", description = "Datos para crear o actualizar un producto del catálogo")
public record ProductoRequest(
        @Schema(description = "Código único del producto", example = "FER-001", requiredMode = Schema.RequiredMode.REQUIRED)
        String codigo,

        @Schema(description = "Nombre del producto", example = "Martillo carpintero 16 oz", requiredMode = Schema.RequiredMode.REQUIRED)
        String nombre,

        @Schema(description = "Categoría a la que pertenece", example = "Herramientas")
        String categoria,

        @Schema(description = "Precio unitario en CLP", example = "8990.00")
        BigDecimal precio,

        @Schema(description = "Unidades disponibles en bodega", example = "25")
        Integer stock,

        @Schema(description = "Descripción detallada del producto", example = "Mango de madera, cabeza de acero forjado")
        String descripcion,

        @Schema(description = "Indica si el producto está visible en la tienda", example = "true", defaultValue = "true")
        Boolean activo
) {
}
