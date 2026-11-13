package com.stackertriple.ferreterialosmaestros.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Respuesta del login: datos de la sesión + token JWT.
 */
@Schema(name = "SesionResponse", description = "Sesión autenticada con el token JWT que debe enviarse en el header Authorization")
public record SesionResponse(
        @Schema(description = "Identificador del usuario", example = "1")
        Long id,

        @Schema(description = "Nombre completo del usuario", example = "Administrador General")
        String nombre,

        @Schema(description = "Nombre de usuario", example = "admin")
        String usuario,

        @Schema(description = "Rol asignado", example = "Administrador",
                allowableValues = {"Administrador", "Vendedor", "Cliente"})
        String rol,

        @Schema(description = "Token JWT firmado (usar como 'Bearer <token>')",
                example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.firma")
        String token
) {
}
