package com.stackertriple.ferreterialosmaestros.dto.response;

public record UsuarioResponse(
        Long id,
        String nombre,
        String usuario,
        String rol,
        Boolean enabled,
        String email
) {
}
