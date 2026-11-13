package com.stackertriple.ferreterialosmaestros.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UsuarioResponse", description = "Usuario del sistema con su rol y estado")
public record UsuarioResponse(
        @Schema(description = "Identificador del usuario", example = "1")
        Long id,

        @Schema(description = "Nombre completo", example = "Administrador General")
        String nombre,

        @Schema(description = "Nombre de usuario", example = "admin")
        String usuario,

        @Schema(description = "Rol asignado", example = "Administrador",
                allowableValues = {"Administrador", "Vendedor", "Cliente"})
        String rol,

        @Schema(description = "Indica si la cuenta está habilitada", example = "true")
        Boolean enabled,

        @Schema(description = "Correo electrónico", example = "admin@ferreteria.cl")
        String email
) {
}
