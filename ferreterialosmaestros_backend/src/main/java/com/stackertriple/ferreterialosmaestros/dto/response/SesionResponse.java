package com.stackertriple.ferreterialosmaestros.dto.response;

public record SesionResponse(
        Long id,
        String nombre,
        String usuario,
        String rol,
        Boolean enabled,
        String email
) {
}
