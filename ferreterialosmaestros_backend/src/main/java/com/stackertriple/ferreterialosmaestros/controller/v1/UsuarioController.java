package com.stackertriple.ferreterialosmaestros.controller.v1;

import com.stackertriple.ferreterialosmaestros.dto.response.UsuarioResponse;
import com.stackertriple.ferreterialosmaestros.model.entity.Usuario;
import com.stackertriple.ferreterialosmaestros.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

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
