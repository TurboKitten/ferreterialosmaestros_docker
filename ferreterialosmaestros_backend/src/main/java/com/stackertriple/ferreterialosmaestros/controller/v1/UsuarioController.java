package com.stackertriple.ferreterialosmaestros.controller.v1;

import com.stackertriple.ferreterialosmaestros.config.OpenApiConfig;
import com.stackertriple.ferreterialosmaestros.dto.response.UsuarioResponse;
import com.stackertriple.ferreterialosmaestros.model.entity.Usuario;
import com.stackertriple.ferreterialosmaestros.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Usuarios", description = "Consulta de usuarios del sistema (solo Administrador)")
@SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME_NAME)
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Operation(summary = "Listar usuarios", description = "Devuelve todos los usuarios con su rol y estado. Requiere rol Administrador.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado de usuarios",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = UsuarioResponse.class)))),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol Administrador", content = @Content)
    })
    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(this::toResponse).toList();
    }

    private UsuarioResponse toResponse(Usuario u) {
        String rol = u.getRol() != null ? switch (u.getRol()) {
            case ADMINISTRADOR -> "Administrador";
            case VENDEDOR -> "Vendedor";
            case CLIENTE -> "Cliente";
        } : null;
        return new UsuarioResponse(u.getId(), u.getNombre(), u.getUsername(), rol, u.getEnabled(), u.getEmail());
    }
}
