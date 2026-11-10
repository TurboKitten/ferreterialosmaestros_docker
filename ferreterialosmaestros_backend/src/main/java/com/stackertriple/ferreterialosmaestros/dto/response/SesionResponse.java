package com.stackertriple.ferreterialosmaestros.dto.response;

/**
 * Respuesta del login: datos de la sesión + token JWT.
 */
public record SesionResponse(
        Long id,
        String nombre,
        String usuario,
        String rol,
        String token
) {
}
