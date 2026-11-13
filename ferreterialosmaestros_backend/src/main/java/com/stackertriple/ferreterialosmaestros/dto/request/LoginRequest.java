package com.stackertriple.ferreterialosmaestros.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "LoginRequest", description = "Credenciales de acceso enviadas al endpoint de login")
public record LoginRequest(
        @Schema(description = "Alias de usuario (se mantiene por compatibilidad con el frontend)",
                example = "admin")
        String usuario,

        @Schema(description = "Nombre de usuario registrado", example = "admin")
        String username,

        @Schema(description = "Contraseña en texto plano", example = "admin123", requiredMode = Schema.RequiredMode.REQUIRED)
        String password
) {
    public String resolvedUsername() {
        return (username != null && !username.isBlank()) ? username : usuario;
    }
}
